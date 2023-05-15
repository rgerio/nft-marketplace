import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { Container } from '../Container';
import { Paper } from '../Paper';
import { useCallback, useEffect, useState } from 'react';
import { Input } from '../Input';
import { useWeb3 } from '../../features/web3/hooks/useWeb3';
import { Button } from '../Button';
import { toNumberConsideringEmptyNaN } from '../../utils/utils';

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
    getNFTMarketplaceAllowance,
    listNFTForSale,
    accountAddress,
    connectWallet,
  } = useWeb3();

  const [NFTMarketplaceAllowance, setNFTMarketplaceAllowance] = useState<
    boolean | null
  >(null);
  useEffect(() => {
    const localSetNFTMarketplaceAllowance = async () =>
      setNFTMarketplaceAllowance(
        await getNFTMarketplaceAllowance(
          selectedNFTContract,
          toNumberConsideringEmptyNaN(selectedNFTTokenId),
        ),
      );
    localSetNFTMarketplaceAllowance();
  }, [getNFTMarketplaceAllowance, selectedNFTContract, selectedNFTTokenId]);

  const onSubmit = useCallback<SubmitHandler<Inputs>>(
    (data) => {
      console.log(data);
      listNFTForSale({
        nftContract: data.nftContract,
        tokenId: toNumberConsideringEmptyNaN(data.nftTokenID),
        tokenContract: data.tokenContract,
        price: toNumberConsideringEmptyNaN(data.nftPrice),
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
              error={!!errors.nftTokenID}
              helperText={errors.nftTokenID?.message}
            />

            <Input
              {...register('nftPrice', {
                required: {
                  value: true,
                  message: 'This field is required',
                },
              })}
              label="NFT Price: "
              error={!!errors.nftTokenID}
              helperText={errors.nftTokenID?.message}
            />

            {!accountAddress ? (
              <Button size="large" onClick={connectWallet}>
                Connect Wallet
              </Button>
            ) : NFTMarketplaceAllowance === true ? (
              <Button type="submit" size="large" onClick={connectWallet}>
                List NFT for sell
              </Button>
            ) : NFTMarketplaceAllowance === false ? (
              <Button size="large" onClick={() => {}}>
                Approve
              </Button>
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
