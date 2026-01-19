# PocketLove.ai - Romantic Email Templates

These templates are designed for Supabase Authentication emails. They feature a romantic, premium aesthetic consistent with the PocketLove brand.

## 🎨 Styles & Theme
- **Background**: Dark premium (`#1a1a1a`)
- **Card**: Slightly lighter dark (`#252525`)
- **Text**: White/Gray (`#ffffff`, `#d4d4d4`)
- **Action Color**: Neon Pink (`#ec4899`) or Sky Blue (`#0ea5e9`)

---

## 1. Confirm Your Signup (Verification)

**Subject:** Welcome to your romance... confirm your account ❤️

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to PocketLove.ai</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; padding-bottom: 40px;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <h1 style="color: #ffffff; font-size: 24px; letter-spacing: 2px; margin: 0;">POCKET<span style="color: #ec4899;">LOVE</span>.AI</h1>
            </td>
        </tr>
        <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #161616; border-radius: 16px; border: 1px solid #333333; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
                    <!-- Hero Image / Banner -->
                    <tr>
                        <td align="center" style="padding: 40px 0 20px 0;">
                            <img src="https://res.cloudinary.com/ddg02aqiw/image/upload/v1/assets/email-heart-icon.png" alt="Love" width="60" style="display: block; opacity: 0.9;" />
                            <!-- Alternatively use an emoji if image fails: <span style="font-size: 48px;">💖</span> -->
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center" style="padding: 0 40px;">
                            <h2 style="color: #ffffff; font-size: 28px; font-weight: 300; margin: 0 0 10px 0;">Your story begins here</h2>
                            <p style="color: #a3a3a3; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                                You are moments away from meeting your perfect AI companion. We just need to verify your email address to get started.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding: 0 40px 40px 40px;">
                            <a href="{{ .ConfirmationURL }}" style="background-color: #ec4899; background-image: linear-gradient(135deg, #ec4899 0%, #db2777 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; transition: opacity 0.3s; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);">
                                Confirm My Account
                            </a>
                            
                            <p style="color: #525252; font-size: 12px; margin-top: 30px;">
                                If you didn't create an account, you can safely ignore this email.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td align="center" style="padding-top: 20px;">
                <p style="color: #404040; font-size: 12px;">&copy; 2026 PocketLove.ai - Your desires, reimagined.</p>
            </td>
        </tr>
    </table>
</body>
</html>
```

## 2. Reset Password

**Subject:** Let's get you back in... 🔐

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; padding-bottom: 40px;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <h1 style="color: #ffffff; font-size: 24px; letter-spacing: 2px; margin: 0;">POCKET<span style="color: #0ea5e9;">LOVE</span>.AI</h1>
            </td>
        </tr>
        <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #161616; border-radius: 16px; border: 1px solid #333333; overflow: hidden;">
                    <tr>
                        <td align="center" style="padding: 40px 40px;">
                            <h2 style="color: #ffffff; font-size: 24px; font-weight: 600; margin-bottom: 20px;">Reset Your Password</h2>
                            <p style="color: #a3a3a3; font-size: 16px; line-height: 24px; margin-bottom: 30px;">
                                Forgotten your key? No worries. Click the button below to reset your password and reconnect with your companions.
                            </p>
                            
                            <a href="{{ .ConfirmationURL }}" style="background-color: #0ea5e9; background-image: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);">
                                Reset Password
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

## 3. Magic Link (Passwordless)

**Subject:** Your magic key to PocketLove ✨

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; padding-bottom: 40px;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <h1 style="color: #ffffff; font-size: 24px; letter-spacing: 2px; margin: 0;">POCKET<span style="color: #ec4899;">LOVE</span>.AI</h1>
            </td>
        </tr>
        <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #161616; border-radius: 16px; border: 1px solid #333333;">
                    <tr>
                        <td align="center" style="padding: 50px 40px;">
                            <h2 style="color: #ffffff; font-size: 26px; font-weight: 300; margin-bottom: 10px;">Login instantly</h2>
                            <p style="color: #a3a3a3; font-size: 16px; margin-bottom: 40px;">
                                Click below to sign in automatically. This link expires soon.
                            </p>
                            
                            <a href="{{ .ConfirmationURL }}" style="background-color: #ec4899; background-image: linear-gradient(135deg, #ec4899 0%, #db2777 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);">
                                ✨ Sign In Now
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

## 4. Change Email Address

**Subject:** Confirm your new email address

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; padding-bottom: 40px;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <h1 style="color: #ffffff; font-size: 24px; letter-spacing: 2px; margin: 0;">POCKET<span style="color: #0ea5e9;">LOVE</span>.AI</h1>
            </td>
        </tr>
        <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #161616; border-radius: 16px; border: 1px solid #333333;">
                    <tr>
                        <td align="center" style="padding: 50px 40px;">
                            <h2 style="color: #ffffff; font-size: 24px; font-weight: 600; margin-bottom: 20px;">Confirm Email Update</h2>
                            <p style="color: #a3a3a3; font-size: 16px; margin-bottom: 30px; line-height: 24px;">
                                We received a request to update the email address for your <strong>PocketLove</strong> account.
                                <br><br>
                                Please confirm this change by clicking the button below.
                            </p>
                            
                            <a href="{{ .ConfirmationURL }}" style="background-color: #0ea5e9; background-image: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);">
                                Verify New Email
                            </a>
                            
                            <p style="color: #525252; font-size: 12px; margin-top: 30px;">
                                If you did not request this change, please contact support immediately.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```
