import { useGetCrowdfund } from "@/lib/graphql/hooks/crowdfund";
import {
  Box,
  HStack,
  Text,
  Progress,
  SimpleGrid,
  Flex,
  Badge,
} from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { formatTime, getTime } from "@/utils/time";
import dayjs from "dayjs";
import { ICrowdfundCollection } from "@/lib/app/types";
import CrowdfundGroupBuyButton from "../common/cta/components/crowdfundGroupBuy/components/Button";
import { Flame } from "lucide-react";


interface CrowdfundGroupInfoProps {
  collection: ICrowdfundCollection;
  collectionName: string;
}
const CrowdfundGroupInfo: FC<CrowdfundGroupInfoProps> = (props) => {
  const { collection, collectionName } = props;

  const { data: crowdfundState } = useGetCrowdfund(
    collection.crowdfund
  )

  // get crowdfund variables
  const min_tokens_sold = crowdfundState?.state.min_tokens_sold || 0;
  const price = parseInt(crowdfundState?.state.price.amount || "");
  const denom = crowdfundState?.state.price.denom;
  const amount_to_send = crowdfundState?.state.amount_to_send ?? 0;
  const amount_transferred = crowdfundState?.state.amount_transferred || 0;

  const total_amount_sold = amount_to_send + amount_transferred;
  const total_sold = crowdfundState?.state?.amount_sold || 0;
  const progress = Math.floor(total_sold / min_tokens_sold * 100);

  const expires = getTime(crowdfundState?.state.end_time ?? {});
  const isEnded = expires.isBefore(new Date());
  const [duration, setDuration] = useState(dayjs.duration(0));

  useEffect(() => {
    if (!crowdfundState || !crowdfundState.state) return;
    const tId = setInterval(() => {
      if (isEnded) {
        setDuration(dayjs.duration(0));
        clearInterval(tId);
        return;
      }
      const today = new Date();
      setDuration(dayjs.duration(expires.diff(today)));
    }, 1000);
    return () => clearInterval(tId);
  }, [crowdfundState]);


  return (
    <Box w="full">
      <HStack justify="space-between">
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
          </Text>
          <Text fontSize="xs" fontWeight="thin" fontStyle="light">
            Collection: <b>{collectionName}</b>
          </Text>
        </Box>

      </HStack>

      <Box
        border="1px"
        borderColor="gray.300"
        rounded="lg"
        mt="4"
        p="4"
        minW="xs"
        w="full"
      >

        <Text
          bg="#e6f2e6"
          p={2}
          borderRadius="md"
          display="inline-flex"
          alignItems="center"
          width="62px"
          height="14px"
        >

          <Text ml={2} fontSize="xs" color="green">
            Open
          </Text>
        </Text>
        <br />
        <Text
          p={2}
          display="inline-flex"
          alignItems="center"
          fontSize={"lg"}
          fontWeight={"bold"}
        >
          {total_amount_sold} {denom}
        </Text>

        <Text
          display="inline-flex"
          alignItems="center"
          fontSize={"sm"}
        >
          pledged of {min_tokens_sold * price} {denom} goal

        </Text>
        <Progress colorScheme='green' size='sm' mt="3" value={progress} borderRadius="md" />
        <Flex gap="1" align="center" mt='2'>
          <Flame color="orange" width={14} />
          {isEnded ? (
            <Badge colorScheme="red" fontSize='2xs'>
              Sale Ended
            </Badge>
          ) : (
            <Text fontWeight="bold" fontSize="sm">
              Ends on {formatTime(expires)}
            </Text>
          )}
        </Flex>
        <SimpleGrid
          spacing="4"
          columns={3}
          mt="4"
          alignSelf="start"
          maxW="max-content"
          ml="1"
        >
          <Box>
            <Text fontWeight="bold" fontSize="md" ml="0.5">
              {duration.asHours().toFixed(0)}
            </Text>
            <Text fontSize="xs" textStyle="light">
              Hours
            </Text>
          </Box>
          <Box>
            <Text fontWeight="bold" fontSize="md" ml="0.5">
              {duration.minutes()}
            </Text>
            <Text fontSize="xs" textStyle="light">
              Minutes
            </Text>
          </Box>
          <Box>
            <Text fontWeight="bold" fontSize="md" ml="0.5">
              {duration.seconds()}
            </Text>
            <Text fontSize="xs" textStyle="light">
              Seconds
            </Text>
          </Box>
        </SimpleGrid>
        <CrowdfundGroupBuyButton
          disabled={!((crowdfundState?.availableTokens?.length ?? 0) > 0)}
          crowdfundAddress={collection.crowdfund}
          mt="4"
        />
      </Box>
    </Box>
  );
};
export default CrowdfundGroupInfo;
