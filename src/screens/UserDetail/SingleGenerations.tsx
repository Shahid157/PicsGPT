import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import GridList from '../../components/GridList';
import {
  supabaseDynamic,
  supabaseKey,
  supabaseUrl,
} from '../../supabase/supabase';
import {normalize, wp} from '../../styles/responsiveScreen';
import {FontText} from '../../components';
import {colors} from '../../assets';
import {useSelector} from 'react-redux';
import {ActivityIndicator} from 'react-native-paper';
import _ from 'lodash';
import ListSekelton from '../../components/ListSkelton';
import {useNavigation} from '@react-navigation/native';
import {jobStatus} from '../../constants/appConstants';

const PageSize = 10;
const Height = Dimensions.get('window').height;

const SingleGenerations = ({scroll}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [generationData, setGenerationData] = useState<any>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const userId = useSelector((state: any) => state?.auth?.userId);

  const init = async () => {
    if (userId) {
      setLoading(true);
      const count = await getTotalCount();
      setTotalCount(count ?? 0);
      if (!count) {
        setLoading(false);
        return;
      }
      setPage(count < PageSize ? count - 1 : PageSize - 1);

      const results = await getGenerationDetails(
        0,
        count < PageSize ? count - 1 : PageSize - 1,
      );

      setLoading(false);

      if (results) {
        const jobs = _.uniqBy([...results, ...generationData], function (e) {
          return e.job_id;
        });
        setGenerationData(jobs);
      }
    }
  };

  useEffect(() => {
    init();
    return () => {
      setPage(0);
    };
  }, [userId]);

  const getTotalCount = async () => {
    let {count, error} = await supabaseDynamic(supabaseUrl, supabaseKey)
      .from('single_id_user_generations')
      .select('*', {count: 'exact', head: true})
      .eq('status', jobStatus.complete)
      .not('results', 'is', null)
      .eq('user_id', userId);

    return count;
  };

  const getGenerationDetails = async (from: number, to: number) => {
    let {data: single_id_user_generations} = await supabaseDynamic(
      supabaseUrl,
      supabaseKey,
    )
      .from('single_id_user_generations')
      .select('*')
      .eq('status', jobStatus.complete)
      .eq('user_id', userId)
      .not('results', 'is', null)
      .order('created_at', {ascending: false})
      .range(from, to);
    return single_id_user_generations;
  };

  const fetchNextPage = async () => {
    if (isFetching || loading || totalCount <= generationData?.length) return;
    setIsFetching(true);
    const from = page;
    const to = from + PageSize;
    const results = await getGenerationDetails(from, to);
    if (results) {
      const jobs = _.uniqBy([...generationData, ...results], function (e) {
        return e.job_id;
      });
      setPage(to);
      setGenerationData(jobs);
    }
    setIsFetching(false);
  };

  if (loading) {
    return <ListSekelton />;
  }

  return (
    <GridList
      data={generationData}
      listStyle={{marginHorizontal: wp(1), height: Height}}
      imageStyle={styles.modelImage}
      isSelect={false}
      isUserScreen={true}
      onImagePress={(job_id?: string) => {
        navigation.navigate('ImageViewer', {
          jobID: job_id,
        });
      }}
      isProfileGenerationData
      handleScroll={scroll}
      onEndReached={fetchNextPage}
      ListFooterComponent={isFetching ? <ActivityIndicator /> : undefined}
      ListEmptyComponent={
        <View style={{marginTop: 10, alignItems: 'center'}}>
          <FontText name="medium" size={normalize(12)} color={colors.black}>
            {userId
              ? 'You have no generated images!'
              : 'You have no permissions, please Log In first!'}
          </FontText>
        </View>
      }
    />
  );
};

export default SingleGenerations;

const styles = StyleSheet.create({
  modelImage: {
    width: wp(47),
    height: wp(60),
    backgroundColor: 'green',
  },
});
