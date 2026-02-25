import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useAuth } from '../context/AuthContext';
import ApiClient from '../component/ApiClient';
import Ionicons from 'react-native-vector-icons/Ionicons';
// Function defined before usage
const mapLeadTypeToStatus = (type) => {
  switch (type) {
   
    case 'New Lead': return 1;
    case 'InProcess Lead': return 2;
    case 'Hot Lead': return 3;
    case 'Archived Lead': return 4;
    case 'Converted Lead': return 5;
   
    case 'Reassign Lead': return 11;

    default: return "all";
  }
};
const FilterHomeScreen = ({ navigation ,route}) => {
   const { leadsource ,project,leadType,todate,fromdate ,currentForm,teamleader,agent} = route.params || {};
  const [refreshing, setRefreshing] = useState(false);
  const { user, token } = useAuth();
  const [data, setData] = useState({});
// console.log(leadsource ,project,leadType,todate,fromdate ,currentForm,teamleader,agent)
  const onRefresh = () => {
    setRefreshing(true);
    numData(); // ✅ fixed
    setTimeout(() => setRefreshing(false), 1500);
  };
 const leadStatus = useMemo(() => mapLeadTypeToStatus(leadType), [leadType]);
//  console.log(leadStatus)
  useEffect(() => {
  if (user?.user_id && token) {
    numData();
  }

  navigation.setOptions({
    headerLeft: () => (
     <TouchableOpacity
        onPress={() =>
          navigation.navigate('TabNavigator', {
            screen: 'HomeTab',
          })
        }
        style={{ marginLeft: 15 }}
      >
        <Ionicons name="home-outline" size={24} color="#000" />
      </TouchableOpacity>
    ),

    headerRight: () => (
      <TouchableOpacity
        onPress={() => navigation.navigate('Filter')}
        style={{ marginRight: 15 }}
      >
        <Ionicons name="filter-outline" size={24} color="#000" />
      </TouchableOpacity>
    ),

    headerTitle: '', // ❌ text hata diya
  });
}, [user, token, navigation]);


  const numData = async () => {
  const  payload={
    type:currentForm,
    user_id: user.user_id,
    lead_status: leadStatus,
    tl_id:teamleader,
    agent_id:agent,
    project:project,
    lead_source:leadsource,
    from_date:fromdate,
    to_date:todate
  }
  // console.log("post data",payload)
    try {
      const res = await ApiClient.post(`/filter-report`,payload ,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.status === 200) {
        setData(res.data.data);
        // console.log('Dashboard data:', res.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const goToTable = (leadType) => {
    navigation.navigate('FilterSelectTable', { leadType ,teamleader,agent});
  };
// console.log(user)
  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.container}>

        <View style={styles.row}>
          {user?.role === "Admin" && (
            <LeadBox title="Fresh Leads" count={data.fresh_lead} icon={require('../../Assets/icons/Freshlead.png')} onPress={() => goToTable('fresh_lead')} />
          )}
          <LeadBox title="New Leads" count={data.new_lead} icon={require('../../Assets/icons/Newlead.png')} onPress={() => goToTable('new_lead')} />
        </View>

        <View style={styles.row}>
          <LeadBox title="Hot Leads" count={data.hot_lead} icon={require('../../Assets/icons/hot-deal.png')} onPress={() => goToTable('hot_lead')} />
          <LeadBox title="Today's Site Visits" count={data.today_site_visit} icon={require('../../Assets/icons/map.png')} onPress={() => goToTable('today_site_visit')} />
        </View>

        <View style={styles.row}>
          <LeadBox title="Missed Followups" count={data.missed_follow_up} icon={require('../../Assets/icons/miss.png')} onPress={() => goToTable('missed_follow_up')} />
          <LeadBox title="Tomorrow's Site Visits" count={data.tomorrow_site_visit} icon={require('../../Assets/icons/3d-map.png')} onPress={() => goToTable('tomorrow_site_visit')} />
        </View>

        <View style={styles.row}>
          <LeadBox title="Today's Followups" count={data.today_follow_up} icon={require('../../Assets/icons/add-user.png')} onPress={() => goToTable('today_follow_up')} />
          <LeadBox title="Scheduled Site Visits" count={data.scheduled_site_visit} icon={require('../../Assets/icons/question-mark.png')} onPress={() => goToTable('scheduled_site_visit')} />
        </View>

        <View style={styles.row}>
          <LeadBox title="In Process Leads" count={data.in_process} icon={require('../../Assets/icons/progress.png')} onPress={() => goToTable('in_process')} />
          <LeadBox title="Archived Leads" count={data.archived_lead} icon={require('../../Assets/icons/location.png')} onPress={() => goToTable('archived_lead')} />
        </View>
        <View style={styles.row}>
        <LeadBox title="Reassign" count={data.re_assign} icon={require('../../Assets/icons/Reassign.png')} onPress={() => goToTable('re_assign')} />
        <LeadBox title="Converted" count={data.converted} icon={require('../../Assets/icons/Converted.png')} onPress={() => goToTable('converted')} />
        </View>
         <View style={styles.row}>
              
                <LeadBox title="Complete Side Visit" count={data.completed_site_visit} icon={require('../../Assets/icons/Completesitevisit.png')} onPress={() => goToTable('completed_site_visit')} />
                </View>
      </View>
    </ScrollView>
  );
};

const LeadBox = ({ title, count, icon, onPress }) => (
  <TouchableOpacity style={styles.box} onPress={onPress}>
    <Image source={icon} style={{ width: 35, height: 35 }} />
    <Text style={styles.boxText}>{title}</Text>
    <Text style={styles.boxnumber}>{count || 0}</Text>
  </TouchableOpacity>
);

export default FilterHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  box: {
    backgroundColor: '#fff',
    flex: 1,
    marginHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  boxText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  boxnumber: {
    fontWeight: 'bold',
    fontSize: 17,
  },
});
