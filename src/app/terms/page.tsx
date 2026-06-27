import type { Metadata } from 'next';
import { LegalLayout } from '@/components/marketing/LegalLayout';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms and conditions governing your use of the NOVYR store.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="June 2026">
      <p>By accessing or purchasing from {SITE.name}, you agree to the following terms.</p>

      <h2>Orders & pricing</h2>
      <p>All prices are listed in Moroccan Dirham (DH) and include applicable taxes. We reserve the right to correct pricing errors and to refuse or cancel any order, including in cases of suspected fraud or stock unavailability.</p>

      <h2>Payment</h2>
      <p>Orders are paid via cash on delivery. By placing an order you commit to receiving and paying for it on delivery. Repeated refusal of confirmed COD orders may result in restrictions on future purchases.</p>

      <h2>Products</h2>
      <p>We make every effort to display our products accurately. Slight variations in colour may occur due to screen settings and photography. Limited drops are produced in restricted quantities and are not guaranteed to be restocked.</p>

      <h2>Intellectual property</h2>
      <p>All content on this site — including designs, graphics, logos and text — is the property of {SITE.name} and may not be reproduced without permission.</p>

      <h2>Limitation of liability</h2>
      <p>{SITE.name} is not liable for any indirect or consequential damages arising from the use of our products or website, to the maximum extent permitted by law.</p>

      <h2>Changes to these terms</h2>
      <p>We may update these terms from time to time. Continued use of the site constitutes acceptance of the updated terms.</p>

      <h2>Contact</h2>
      <p>For any questions about these terms, contact us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
    </LegalLayout>
  );
}
