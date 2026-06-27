import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { SettingsForm } from '@/components/account/SettingsForm';

export default async function SettingsPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { name: true, email: true, phone: true },
  });

  return (
    <SettingsForm
      initial={{
        name: user?.name ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
      }}
    />
  );
}
