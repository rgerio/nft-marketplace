import { AiOutlineWallet } from 'react-icons/ai';
import { useMemo } from 'react';
import { Button } from '../Button';
import { useWeb3 } from '../../features/web3/hooks/useWeb3';

export function WalletIndicator() {
  const { accountAddress, connectWallet } = useWeb3();

  const shortAccountAddress = useMemo(() => {
    if (!accountAddress || accountAddress.length < 11) {
      return accountAddress;
    }
    return `${accountAddress.slice(0, 6)}...${accountAddress.slice(-4)}`;
  }, [accountAddress]);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        {shortAccountAddress ? (
          <div className="py-2 px-4 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full hover:shadow-md transition">
            <AiOutlineWallet />
            <div>{shortAccountAddress}</div>
          </div>
        ) : (
          <Button onClick={connectWallet}>Connect Wallet</Button>
        )}
      </div>
    </div>
  );
}
