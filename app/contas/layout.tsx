import type { Metadata } from 'next'
//Main Components Header and SideBar
import { Headerr, SideNav } from '@/components';
//Wrapper of the main content page
import PageWrapper from '@/components/page-wrapper';
//Wrapper of the Header an of the Content Page to separate it from the SideBar
import MarginWidthWrapper from '@/components/margin-width-wrapper';


export const metadata: Metadata = {
  title: 'InovDrop',
  description: 'Gerencie suas contas aqui',
}

export default function ContasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <section className='relative'>
        <div className='flex'>
          <SideNav />
          <main className='flex-1'>
            <MarginWidthWrapper>
              <Headerr />
              <PageWrapper>{children}</PageWrapper>
            </MarginWidthWrapper>
          </main>
        </div>

      </section>
  )
}
