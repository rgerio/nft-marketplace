import { useCallback, useEffect, useMemo, useState } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import NFTMarketplaceABI from '../../../contracts/NFTMarketplaceABI.json';
import ERC721ABI from '../../../contracts/ERC721ABI.json';
import { validateAddress } from '../../../utils/utils';

const NFT_MARKETPLACE_CONTRACT_ADDRESS =
  import.meta.env.VITE_NFT_MARKETPLACE_CONTRACT_ADDRESS ?? '';

export function useWeb3() {
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);

  const accountAddress = useMemo(
    () => (accounts && accounts.length > 0 ? accounts[0] : null),
    [accounts],
  );

  const getWeb3Instance = useCallback(() => {
    if (!window.ethereum) {
      setError(`No MetaMask found!`);
      return null;
    }

    const web3Instance = new Web3(window.ethereum);

    setError(null);
    return web3Instance;
  }, []);

  const handleAccountsChanged = useCallback(async () => {
    setAccounts((await getWeb3Instance()?.eth.getAccounts()) ?? []);
  }, [getWeb3Instance]);

  useEffect(() => {
    window.ethereum?.on('accountsChanged', handleAccountsChanged);
    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [handleAccountsChanged]);

  useEffect(() => {
    handleAccountsChanged();
  }, [handleAccountsChanged]);

  const connectWallet = useCallback(async () => {
    const web3Instance = getWeb3Instance();
    try {
      const newAccounts = await web3Instance?.eth.requestAccounts();
      if (!newAccounts || !newAccounts.length) {
        throw new Error('Wallet not found/allowed!');
      }
      setError(null);
      return newAccounts;
    } catch (error) {
      setError(
        typeof error === 'string'
          ? error
          : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          typeof (error as any)?.message === 'string'
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ((error as any)?.message as string)
          : 'Something went wrong.',
      );
      return null;
    }
  }, [getWeb3Instance]);

  const getContract = useCallback(
    (abi: AbiItem[], contractAddress: string) => {
      const web3 = getWeb3Instance();
      if (!web3 || !validateAddress(contractAddress)) {
        return null;
      }
      return new web3.eth.Contract(abi, contractAddress, { from: accounts[0] });
    },
    [accounts, getWeb3Instance],
  );

  const getNFTMarketplaceContract = useCallback(() => {
    return getContract(
      NFTMarketplaceABI as AbiItem[],
      NFT_MARKETPLACE_CONTRACT_ADDRESS,
    );
  }, [getContract]);

  const getNFTContract = useCallback(
    (address: string) => {
      return getContract(ERC721ABI as AbiItem[], address);
    },
    [getContract],
  );

  const getNFTOwnerOf = useCallback(
    async (NFTContract: string, NFTTokenId: number) => {
      if (!validateAddress(NFTContract) || isNaN(NFTTokenId)) {
        return null;
      }

      try {
        const ownerOf = await getNFTContract(NFTContract)
          ?.methods.ownerOf(NFTTokenId)
          .call();
        return ownerOf;
      } catch (e) {
        return null;
      }
    },
    [getNFTContract],
  );

  const getNFTMarketplaceAllowance = useCallback(
    async (NFTContract: string, NFTTokenId: number) => {
      if (!validateAddress(NFTContract) || isNaN(NFTTokenId)) {
        return null;
      }

      try {
        const approvedAddress = await getNFTContract(NFTContract)
          ?.methods.getApproved(NFTTokenId)
          .call();

        const NFTOwner = await getNFTOwnerOf(NFTContract, NFTTokenId);
        return (
          NFT_MARKETPLACE_CONTRACT_ADDRESS === approvedAddress ||
          NFT_MARKETPLACE_CONTRACT_ADDRESS === NFTOwner
        );
      } catch (e) {
        return null;
      }
    },
    [getNFTContract, getNFTOwnerOf],
  );

  const listNFTForSale = useCallback(
    async ({
      nftContract,
      tokenId,
      tokenContract,
      price,
    }: {
      nftContract: string;
      tokenId: number;
      tokenContract: string;
      price: number;
    }) => {
      if (!(await getNFTMarketplaceAllowance(nftContract, tokenId))) {
        setError('User has not allowed NFT transfer yet');
      }

      try {
        const contract = getNFTMarketplaceContract();
        if (!contract) return;
        const tx = await contract.methods
          .listNFTForSale(nftContract, tokenId, tokenContract, price)
          .send();
        alert(JSON.stringify(tx));
      } catch (error) {
        setError(
          typeof error === 'string'
            ? error
            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
            typeof (error as any)?.message === 'string'
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ((error as any)?.message as string)
            : 'Something went wrong.',
        );
      }
    },
    [getNFTMarketplaceAllowance, getNFTMarketplaceContract],
  );

  const approveNFTForSale = useCallback(
    async ({
      nftContract,
      tokenId,
    }: {
      nftContract: string;
      tokenId: number;
    }) => {
      try {
        const contract = getNFTContract(nftContract);
        if (!contract) return;
        await contract.methods
          .approve(NFT_MARKETPLACE_CONTRACT_ADDRESS, tokenId)
          .send();
      } catch (error) {
        setError(
          typeof error === 'string'
            ? error
            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
            typeof (error as any)?.message === 'string'
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ((error as any)?.message as string)
            : 'Something went wrong.',
        );
      }
    },
    [getNFTContract],
  );

  return {
    getWeb3Instance,
    connectWallet,
    accountAddress,
    error,
    getNFTOwnerOf,
    getNFTMarketplaceAllowance,
    listNFTForSale,
    approveNFTForSale,
  };
}
