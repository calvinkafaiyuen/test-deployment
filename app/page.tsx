import HatcheryNavigation from '@/app/ui/navigation';
import HomeBody from '@/app/ui/public/home';
import HatcheryFooter from '@/app/ui/footer';

export default async function Page() {
  return (
    <main className="flex min-h-screen flex-col w-full 2xl:w-1/2 xl:mx-auto">
      <HatcheryNavigation />
      <HomeBody/>
      <HatcheryFooter />
    </main>
  );
}
