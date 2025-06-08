export interface EmailTemplate {
    id: string
    name: string
    description: string
    preview: string
    html: string
    variables: string[]
}

export const emailTemplates: EmailTemplate[] = [
    {
        id: 'modern',
        name: 'Moderne',
        description: 'Template moderne avec design épuré',
        preview: '/templates/modern-preview.png',
        variables: ['{{name}}', '{{company}}', '{{date}}'],
        html: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                    <!-- En-tête -->
                    <tr>
                        <td style="background: linear-gradient(135deg, {{primary_color}} 0%, {{secondary_color}} 100%); padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                {{company}}
                            </h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
                                Newsletter • {{date}}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Contenu principal -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: {{text_color}}; margin: 0 0 20px 0; font-size: 24px; font-weight: 600; line-height: 1.3;">
                                Bonjour {{name}} ! 👋
                            </h2>
                            
                            <div style="color: {{text_color}}; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                {{content}}
                            </div>
                            
                            <!-- CTA Button -->
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="{{cta_url}}" style="display: inline-block; background: linear-gradient(135deg, {{primary_color}} 0%, {{secondary_color}} 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; transition: all 0.3s ease;">
                                            {{cta_text}}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f7fafc; padding: 30px; border-radius: 0 0 12px 12px; text-align: center; border-top: 1px solid {{border_color}};">
                            <p style="color: #718096; font-size: 14px; margin: 0 0 10px 0;">
                                Vous recevez cet email car vous êtes abonné à notre newsletter.
                            </p>
                            <p style="color: #718096; font-size: 14px; margin: 0;">
                                <a href="{{unsubscribe_url}}" style="color: {{accent_color}}; text-decoration: none;">Se désinscrire</a> • 
                                <a href="{{company_url}}" style="color: {{accent_color}}; text-decoration: none;">Notre site web</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `
    },

    {
        id: 'minimal',
        name: 'Minimaliste',
        description: 'Template simple et élégant',
        preview: '/templates/minimal-preview.png',
        variables: ['{{name}}', '{{company}}', '{{date}}'],
        html: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #ffffff; color: #4a5568;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
            <td align="center" style="padding: 60px 20px;">
                <table cellpadding="0" cellspacing="0" border="0" width="560" style="max-width: 560px;">
                    <!-- En-tête minimaliste -->
                    <tr>
                        <td style="text-align: center; padding-bottom: 40px; border-bottom: 2px solid {{primary_color}};">
                            <h1 style="margin: 0; font-size: 32px; font-weight: 400; letter-spacing: 2px; text-transform: uppercase; color: {{primary_color}};">
                                {{company}}
                            </h1>
                            <p style="margin: 15px 0 0 0; font-size: 14px; color: {{text_color}}; font-style: italic;">
                                {{date}}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Contenu -->
                    <tr>
                        <td style="padding: 50px 0;">
                            <p style="font-size: 18px; line-height: 1.6; margin: 0 0 30px 0; color: {{primary_color}};">
                                Cher {{name}},
                            </p>
                            
                            <div style="font-size: 16px; line-height: 1.8; color: {{text_color}}; margin-bottom: 40px;">
                                {{content}}
                            </div>
                            
                            <!-- CTA simple -->
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 40px 0;">
                                <tr>
                                    <td>
                                        <a href="{{cta_url}}" style="display: inline-block; border: 2px solid {{accent_color}}; color: {{accent_color}}; text-decoration: none; padding: 12px 24px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s ease; border-radius: 4px;">
                                            {{cta_text}}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer minimaliste -->
                    <tr>
                        <td style="text-align: center; padding-top: 40px; border-top: 1px solid {{border_color}};">
                            <p style="font-size: 12px; color: #a0aec0; margin: 0; line-height: 1.5;">
                                © {{company}} • <a href="{{unsubscribe_url}}" style="color: {{accent_color}}; text-decoration: none;">Se désinscrire</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `
    },

    {
        id: 'corporate',
        name: 'Corporate',
        description: 'Template professionnel pour entreprises',
        preview: '/templates/corporate-preview.png',
        variables: ['{{name}}', '{{company}}', '{{date}}', '{{position}}', '{{highlights}}'],
        html: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 30px 20px;">
                <table cellpadding="0" cellspacing="0" border="0" width="650" style="max-width: 650px; background-color: #ffffff;">
                    <!-- En-tête corporate -->
                    <tr>
                        <td style="background-color: {{primary_color}}; padding: 25px 30px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td>
                                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
                                            {{company}}
                                        </h1>
                                        <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                                            Newsletter Officielle
                                        </p>
                                    </td>
                                    <td style="text-align: right;">
                                        <p style="color: #ffffff; margin: 0; font-size: 14px;">
                                            {{date}}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Barre colorée -->
                    <tr>
                        <td style="background-color: {{secondary_color}}; height: 4px;"></td>
                    </tr>
                    
                    <!-- Contenu principal -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td>
                                        <h2 style="color: {{primary_color}}; margin: 0 0 10px 0; font-size: 20px; font-weight: 600;">
                                            {{name}}{{#if position}}, {{position}}{{/if}}
                                        </h2>
                                        
                                        <div style="color: {{text_color}}; font-size: 15px; line-height: 1.7; margin-bottom: 35px;">
                                            {{content}}
                                        </div>
                                        
                                        <!-- Highlights section -->
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 35px 0;">
                                            <tr>
                                                <td style="background-color: #f8fafc; padding: 25px; border-left: 4px solid {{accent_color}};">
                                                    <h3 style="color: {{primary_color}}; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
                                                        Points clés de cette semaine
                                                    </h3>
                                                    <div style="color: {{text_color}}; font-size: 14px; line-height: 1.6;">
                                                        {{highlights}}
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- CTA Button -->
                                        <table cellpadding="0" cellspacing="0" border="0" style="margin: 35px 0;">
                                            <tr>
                                                <td>
                                                    <a href="{{cta_url}}" style="display: inline-block; background-color: {{primary_color}}; color: #ffffff; text-decoration: none; padding: 14px 28px; font-size: 15px; font-weight: 600; border-radius: 4px;">
                                                        {{cta_text}}
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer corporate -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 25px 30px; border-top: 1px solid {{border_color}};">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td>
                                        <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.5;">
                                            <strong>{{company}}</strong><br>
                                            Vous recevez cet email en tant que membre de notre communauté professionnelle.
                                        </p>
                                    </td>
                                    <td style="text-align: right;">
                                        <a href="{{unsubscribe_url}}" style="color: {{accent_color}}; font-size: 12px; text-decoration: none;">
                                            Se désinscrire
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `
    },

    {
        id: 'newsletter',
        name: 'Newsletter',
        description: 'Template parfait pour les newsletters régulières',
        preview: '/templates/newsletter-preview.png',
        variables: ['{{name}}', '{{company}}', '{{date}}', '{{issue_number}}', '{{resources}}'],
        html: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0;">
                    <!-- Header avec numéro -->
                    <tr>
                        <td style="background-color: {{primary_color}}; padding: 20px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">
                                {{company}}
                            </h1>
                            <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 14px; font-weight: 600;">
                                NEWSLETTER #{{issue_number}} • {{date}}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Salutation -->
                    <tr>
                        <td style="padding: 30px 30px 20px 30px; background-color: #f8fafc;">
                            <p style="color: {{primary_color}}; font-size: 16px; margin: 0; font-weight: 600;">
                                Bonjour {{name}},
                            </p>
                            <p style="color: {{text_color}}; font-size: 14px; margin: 10px 0 0 0;">
                                Voici votre résumé hebdomadaire des actualités importantes.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Contenu principal -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <!-- Section Articles -->
                            <h2 style="color: {{primary_color}}; margin: 30px 0 20px 0; font-size: 20px; font-weight: 700; border-bottom: 2px solid {{primary_color}}; padding-bottom: 10px;">
                                À la Une
                            </h2>
                            
                            <div style="margin-bottom: 30px; color: {{text_color}};">
                                {{content}}
                            </div>
                            
                            <!-- Section Ressources -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0; background-color: #fef3c7; border-radius: 8px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="color: {{accent_color}}; margin: 0 0 15px 0; font-size: 16px; font-weight: 700;">
                                            Ressources Utiles
                                        </h3>
                                        <div style="color: {{text_color}}; font-size: 14px; line-height: 1.6;">
                                            {{resources}}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Section -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0;">
                                <tr>
                                    <td style="text-align: center; padding: 25px; background-color: {{secondary_color}}; border-radius: 8px;">
                                        <h3 style="color: #ffffff; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                                            {{cta_title|default:"Rejoignez la Discussion"}}
                                        </h3>
                                        <p style="color: rgba(255,255,255,0.9); margin: 0 0 20px 0; font-size: 14px;">
                                            {{cta_description|default:"Partagez vos réactions et participez aux échanges."}}
                                        </p>
                                        <a href="{{cta_url}}" style="display: inline-block; background-color: {{accent_color}}; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: 600; font-size: 15px;">
                                            {{cta_text}}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer avec stats -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 25px 30px; border-top: 1px solid {{border_color}};">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td>
                                        <p style="color: {{text_color}}; font-size: 12px; margin: 0 0 5px 0; font-weight: 600;">
                                            Newsletter {{company}} #{{issue_number}}
                                        </p>
                                        <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.4;">
                                            Vous faites partie de nos {{subscriber_count}} abonnés. 
                                            <a href="{{unsubscribe_url}}" style="color: {{accent_color}}; text-decoration: none;">Se désinscrire</a> • 
                                            <a href="{{archive_url}}" style="color: {{accent_color}}; text-decoration: none;">Archives</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `
    }
]

export const getTemplate = (id: string): EmailTemplate | undefined => {
    return emailTemplates.find(template => template.id === id)
}

export const processTemplate = (template: EmailTemplate, variables: Record<string, string>): string => {
    let html = template.html

    html = html.replace(/{{(\w+)\|default:"([^"]+)"}}/g, (match, key, defaultValue) => {
        return variables[key] || defaultValue
    })

    html = html.replace(/{{#if\s+(\w+)}}(.*?){{\/if}}/gs, (match, condition, content) => {
        return variables[condition] ? content : ''
    })

    Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g')
        html = html.replace(regex, value || '')
    })

    html = html.replace(/{{[^}]+}}/g, '')

    return html
}

export function addEmailTracking(html: string, campaignId: number, baseUrl: string = 'http://localhost:3000'): string {
    const trackingPixel = `<img src="${baseUrl}/api/track/open/${campaignId}" width="1" height="1" style="display:none;" alt="" />`

    if (html.includes('</body>')) {
        html = html.replace('</body>', `${trackingPixel}</body>`)
    } else {
        html += trackingPixel
    }

    html = html.replace(/href="([^"]+)"/g, (match, url) => {
        if (url.startsWith('#') || url.includes('unsubscribe') || url.startsWith('mailto:')) {
            return match
        }

        const trackingUrl = `${baseUrl}/api/track/click/${campaignId}?url=${encodeURIComponent(url)}`
        return `href="${trackingUrl}"`
    })

    return html
} 