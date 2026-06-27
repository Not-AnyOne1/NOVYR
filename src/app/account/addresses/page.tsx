import { auth } from '@/auth';
import { getUserAddresses } from '@/lib/queries';
import { AddressManager } from '@/components/account/AddressManager';

export default async function AddressesPage() {
  const session = await auth();
  const addresses = await getUserAddresses(session!.user.id);
  return <AddressManager initial={addresses} />;
}
