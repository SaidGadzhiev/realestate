import * as config from '../config.js';

const style = `
   
        background: #eee;
        padding: 20px;
        border-radius: 20px;
    
`;

export const emailTemplate = (email, content, replyTo, subject) => {
	console.log(content);
	return {
		Source: config.EMAIL_FROM,
		Destination: {
			ToAddresses: [email],
		},
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: `
                <html>
                </head>
                <div style="${style}">
                <h1> Welcome to the app</h1>
                ${content}
                <p>&copy; ${new Date().getFullYear()}</p>
                </div>
                
                </html>
                `,
				},
			},
			Subject: {
				Charset: 'UTF-8',
				Data: 'Welcome to real estate website',
			},
		},
	};
};
