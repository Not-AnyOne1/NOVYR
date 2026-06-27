import type { Metadata } from 'next';
import { LegalLayout } from '@/components/marketing/LegalLayout';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How NOVYR collects, uses and protects your personal data.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="June 2026">
      <p>Your privacy matters to us. This policy explains what data we collect, how we use it, and your rights.</p>

      <h2>Information we collect</h2>
      <ul>
        <li><strong>Order information:</strong> name, phone number, delivery address and (optionally) email, used to process and deliver your orders.</li>
        <li><strong>Account information:</strong> if you create an account, we store your name, email and a securely hashed password.</li>
        <li><strong>Usage data:</strong> anonymous analytics about how you use the site, to improve your experience.</li>
      </ul>

      <h2>How we use your information</h2>
      <ul>
        <li>To process, confirm and deliver your orders.</li>
        <li>To provide customer support and respond to your enquiries.</li>
        <li>To send marketing emails about drops and offers — only if you opt in. You can unsubscribe at any time.</li>
        <li>To detect and prevent fraud and abuse.</li>
      </ul>

      <h2>Cookies & analytics</h2>
      <p>We use cookies and tools such as Google Analytics and the Meta Pixel to understand traffic and improve our store and advertising. These tools may collect anonymised usage data. You can control cookies through your browser settings.</p>

      <h2>Data sharing</h2>
      <p>We never sell your personal data. We only share what is necessary with our delivery partners to fulfil your order, and with service providers who help us run the store under strict confidentiality.</p>

      <h2>Data security</h2>
      <p>We use industry-standard security measures, including encrypted connections and hashed passwords, to protect your information.</p>

      <h2>Your rights</h2>
      <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
    </LegalLayout>
  );
}
