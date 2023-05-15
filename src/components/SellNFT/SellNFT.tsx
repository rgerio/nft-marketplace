import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { Container } from '../Container';
import { Paper } from '../Paper';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Input } from '../Input';
import { useWeb3 } from '../../features/web3/hooks/useWeb3';
import { Button } from '../Button';
import {
  toNumberConsideringEmptyNaN,
  validateAddress,
} from '../../utils/utils';

type Inputs = {
  nftContract: string;
  nftTokenID: string;
  tokenContract: string;
  nftPrice: string;
};

const inputsDefaultValues = {
  nftContract: '',
  nftTokenID: '',
  tokenContract: '',
  nftPrice: '',
};

export function SellNFT() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ defaultValues: inputsDefaultValues });

  const selectedNFTContract = useWatch({ control, name: 'nftContract' });
  const selectedNFTTokenId = useWatch({ control, name: 'nftTokenID' });

  const {
    getNFTOwnerOf,
    getNFTMarketplaceAllowance,
    listNFTForSale,
    accountAddress,
    connectWallet,
    approveNFTForSale,
  } = useWeb3();

  const [NFTOwner, setNFTOwner] = useState<string | null>(null);
  const [NFTMarketplaceAllowance, setNFTMarketplaceAllowance] = useState<
    boolean | null
  >(null);

  const updateSelectedNFTData = useCallback(async () => {
    const tokenId = toNumberConsideringEmptyNaN(selectedNFTTokenId);
    setNFTOwner(await getNFTOwnerOf(selectedNFTContract, tokenId));
    setNFTMarketplaceAllowance(
      await getNFTMarketplaceAllowance(selectedNFTContract, tokenId),
    );
  }, [
    getNFTMarketplaceAllowance,
    getNFTOwnerOf,
    selectedNFTContract,
    selectedNFTTokenId,
  ]);

  useEffect(() => {
    updateSelectedNFTData();
  }, [updateSelectedNFTData]);

  const handleApprove = useCallback(async () => {
    const tokenId = toNumberConsideringEmptyNaN(selectedNFTTokenId);
    await approveNFTForSale({ nftContract: selectedNFTContract, tokenId });
    await updateSelectedNFTData();
  }, [
    approveNFTForSale,
    selectedNFTContract,
    selectedNFTTokenId,
    updateSelectedNFTData,
  ]);

  const isNFTSelected = useMemo(() => {
    return (
      validateAddress(selectedNFTContract) &&
      !isNaN(toNumberConsideringEmptyNaN(selectedNFTTokenId))
    );
  }, [selectedNFTContract, selectedNFTTokenId]);

  const onSubmit = useCallback<SubmitHandler<Inputs>>(
    (data) => {
      const tokenId = toNumberConsideringEmptyNaN(data.nftTokenID);
      const price = toNumberConsideringEmptyNaN(data.nftPrice);
      if (isNaN(price) || isNaN(tokenId)) {
        return;
      }

      listNFTForSale({
        nftContract: data.nftContract,
        tokenId,
        tokenContract: data.tokenContract,
        price,
      });
    },
    [listNFTForSale],
  );

  return (
    <Container>
      <Paper className="max-w-[800px] mx-auto py-8 my-8">
        <Container>
          <h2 className="text-lg text-center font-semibold mb-8">Sell NFTs</h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Input
              {...register('nftContract', {
                required: {
                  value: true,
                  message: 'This field is required',
                },
              })}
              label="NFT Contract: "
              error={!!errors.nftContract}
              helperText={errors.nftContract?.message}
            />

            <Input
              {...register('nftTokenID', {
                required: {
                  value: true,
                  message: 'This field is required',
                },
              })}
              label="NFT Token ID: "
              error={!!errors.nftTokenID}
              helperText={errors.nftTokenID?.message}
            />

            <Input
              {...register('tokenContract', {
                required: {
                  value: true,
                  message: 'This field is required',
                },
              })}
              label="Token Contract: "
              error={!!errors.tokenContract}
              helperText={errors.tokenContract?.message}
            />

            <Input
              {...register('nftPrice', {
                required: {
                  value: true,
                  message: 'This field is required',
                },
              })}
              label="NFT Price: "
              error={!!errors.nftPrice}
              helperText={errors.nftPrice?.message}
            />

            {!accountAddress ? (
              <Button size="large" onClick={connectWallet}>
                Connect Wallet
              </Button>
            ) : isNFTSelected ? (
              NFTOwner !== null && NFTOwner !== accountAddress ? (
                <Button type="submit" size="large" disabled>
                  This NFT is not yours
                </Button>
              ) : NFTMarketplaceAllowance === true ? (
                <Button type="submit" size="large">
                  List NFT for sell
                </Button>
              ) : NFTMarketplaceAllowance === false ? (
                <Button size="large" onClick={handleApprove}>
                  Approve
                </Button>
              ) : (
                <Button type="submit" size="large" disabled>
                  Invalid NFT
                </Button>
              )
            ) : (
              <Button type="submit" size="large" disabled>
                Choose an NFT
              </Button>
            )}
          </form>
        </Container>
      </Paper>
    </Container>
  );
}
