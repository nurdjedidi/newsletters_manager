// @ts-nocheck
import { Resend } from 'resend';
import { getTemplate, processTemplate } from '../../../utils/emailTemplates';
import { pool } from '../db';

const resend = new Resend(process.env.RESEND_API_KEY)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      subject,
      fromName,
      fromEmail,
      content,
      templateName = 'modern',
      templateStyles = {},
      templateVariables = {}
    } = body;

    if (!subject || !fromName || !fromEmail || !content) {
      return {
        success: false,
        message: 'Tous les champs sont requis'
      };
    }

    const [rows] = await pool.execute(
      'SELECT id, email, name FROM newsletters_subscribers WHERE status = 1',
      []
    ) as [any[], any];

    if (rows.length === 0) {
      return {
        success: false,
        message: 'Aucun subscriber actif trouvé'
      };
    }

    let campaignId = null;
    try {
      const [result] = await pool.execute(
        `INSERT INTO campaigns (subject, from_name, from_email, content, template_name, recipients_count, sent_count, failed_count, sent_at) 
         VALUES (?, ?, ?, ?, ?, ?, 0, 0, NOW())`,
        [subject, fromName, fromEmail, content, templateName || 'modern', rows.length]
      ) as [any, any];

      campaignId = result.insertId;
    } catch (dbError) {
      return {
        success: false,
        message: 'Erreur lors de la création de la campagne'
      };
    }

    let sentCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    const batchSize = 10;
    const batches = [];

    for (let i = 0; i < rows.length; i += batchSize) {
      batches.push(rows.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      const emailPromises = batch.map(async (subscriber: any) => {
        try {
          const unsubscribeUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe?email=${encodeURIComponent(subscriber.email)}&id=${subscriber.id}`;

          const allVariables = {
            ...templateVariables,
            ...templateStyles,
            name: subscriber.name || 'Cher(e) abonné(e)',
            content: content,
            subject: subject,
            unsubscribe_url: unsubscribeUrl,
            company: 'NewsFaster',
            date: new Date().toLocaleDateString('fr-FR')
          };

          let finalContent = content;
          if (templateName && templateName !== 'none') {
            const template = getTemplate(templateName);
            if (template) {
              finalContent = processTemplate(template, allVariables);
            }
          }

          const emailData = {
            from: `${fromName} <support@stackunity.tech>`,
            to: [subscriber.email],
            subject: subject,
            html: finalContent
          };

          const result = await resend.emails.send(emailData);

          if (result.error) {
            throw new Error(`Resend error: ${result.error.message}`);
          }

          return { success: true, subscriber: subscriber.email };
        } catch (error) {
          console.error(`Erreur envoi pour ${subscriber.email}:`, error);
          return {
            success: false,
            subscriber: subscriber.email,
            error: (error as Error).message
          };
        }
      });

      const batchResults = await Promise.all(emailPromises);

      batchResults.forEach(result => {
        if (result.success) {
          sentCount++;
        } else {
          failedCount++;
          errors.push(`${result.subscriber}: ${result.error}`);
        }
      });

      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    try {
      await pool.execute(
        `UPDATE campaigns SET sent_count = ?, failed_count = ? WHERE id = ?`,
        [sentCount, failedCount, campaignId]
      );
      console.log(`Campagne ${campaignId} mise à jour: ${sentCount} envoyés, ${failedCount} échecs`);
    } catch (dbError) {
      console.error('Erreur mise à jour campagne:', dbError);
    }

    return {
      success: true,
      message: `Campagne envoyée avec succès`,
      campaignId,
      results: {
        sent: sentCount,
        failed: failedCount,
        total: rows.length,
        errors: errors.slice(0, 10)
      }
    };

  } catch (error) {
    console.error('Erreur lors de l\'envoi de la campagne:', error);
    return {
      success: false,
      message: 'Erreur serveur lors de l\'envoi de la campagne'
    };
  }
}); 