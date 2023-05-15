import { Container } from '../Container';
import { Logo } from './Logo';
import { TabSelector, TabSelectorProps } from './TabSelector';
import { WalletIndicator } from './WalletIndicator';

interface NavbarProps {
  tabSelectorProps: TabSelectorProps;
}

export function Navbar({ tabSelectorProps }: NavbarProps) {
  return (
    <>
      <div className="fixed w-full bg-white z-10 shadow-sm">
        <div className="py-4 border-b-[1px]">
          <Container>
            <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
              <Logo />
              <TabSelector {...tabSelectorProps} />
              <WalletIndicator />
            </div>
          </Container>
        </div>
      </div>

      <div className="h-[85px]"></div>
    </>
  );
}
