import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import ApiClient from '../component/ApiClient';

// Function defined before usage
const mapLeadTypeToStatus = (type) => {
  switch (type) {
    case 'fresh_lead': return 0;
    case 'new_lead': return 1;
    case 'in_process': return 2;
    case 'hot_lead': return 3;
    case 'archived_lead': return 4;
    case 'converted': return 5;
    case 'missed_follow_up': return 6;
    case 'today_site_visit': return 7;
    case 'today_follow_up': return 8;
    case 'tomorrow_site_visit': return 9;
    case 'scheduled_site_visit': return 10;
    case 're_assign': return 11;
     case 'completed_site_visit': return 12;
    default: return 0;
  }
};

const HomeTableList = ({ navigation, route }) => {

const [data, setData] = useState([]);
const [page, setPage] = useState(1);
const [lastPage, setLastPage] = useState(1);
const [loading, setLoading] = useState(false);


  const [expandedRowId, setExpandedRowId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [agentsList, setAgentsList] = useState([]);

  const { user, token } = useAuth();
  const { leadType } = route.params || {};

  // ✅ Memoize the leadStatus value
  const leadStatus = useMemo(() => mapLeadTypeToStatus(leadType), [leadType]);

  const debounceRef = useRef();

  // Debounced search query
  useEffect(() => {
    debounceRef.current && clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  // Fetch data on mount and when user or leadStatus changes
  useEffect(() => {
    if (user?.user_id && token) {
      leadData();
    }
  }, [user, token, leadStatus]);

  // Fetch data when screen is focused
useFocusEffect(
  useCallback(() => {
    if (user?.user_id && token) {
      leadData(1);
    }
  }, [user?.user_id, token, leadStatus])
);

// console.log("lead type",leadStatus)
  // Fetch lead data from API
 const leadData = async (pageNumber = 1) => {
  setLoading(true);
console.log(leadStatus, user.user_id)
  try {
    const res = await ApiClient.post(
      `/get-lead-data?page=${pageNumber}`,
      {
        lead_status: leadStatus,
        user_id: user.user_id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
console.log(res.data)
    if (res.data.status === 200) {
      setData(res.data.data);
      setPage(res.data.meta.current_page);
      setLastPage(res.data.meta.last_page);

      extractAgents(res.data.data);
    } else {
      Alert.alert('Error', res.data.message || 'Failed to fetch data');
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Network issue');
  } finally { 
    setLoading(false);
  }
};

// Button handlers 

const handleNext = () => {
  if (page < lastPage) {
    leadData(page + 1);
  }
};

const handlePrev = () => {
  if (page > 1) {
    leadData(page - 1);
  }
};


  // Extract unique agent names from the data
  const extractAgents = (leads) => {
    const agents = leads
      .map((item) => item.agent)
      .filter((agent, index, self) => agent && self.indexOf(agent) === index);
    setAgentsList(agents);
  };

  // Toggle row expansion
  const handleReadMore = useCallback((id) => {
    // console.log("table", id)
    setExpandedRowId((prevId) => (prevId === id ? null : id));
  }, []);

  const filteredData = useMemo(() => {
    const query = debouncedQuery.toLowerCase();
    // console.log(leadStatus)
    return data.filter((item) => {
      const name = typeof item.name === 'string' ? item.name.toLowerCase() : '';
      const contact = typeof item.contact === 'string' ? item.contact.toLowerCase() : '';
      const project = typeof item.project === 'string' ? item.project.toLowerCase() : '';
      const agent = typeof item.agent === 'string' ? item.agent.toLowerCase() : '';

      const matchesSearch =
        name.includes(query) ||
        contact.includes(query) ||
        project.includes(query) ||
        agent.includes(query);

      const matchesAgent =
        selectedAgent === '' || agent === selectedAgent.toLowerCase();

      return matchesSearch && matchesAgent;
    });
  }, [data, debouncedQuery, selectedAgent]);
  // Render each lead item
  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>

      <View style={styles.firstdata}>

        <Text style={{ fontSize: 17, width: "150" }}>{item.name} </Text>



        <Text style={{ fontSize: 17 }}>
          : {item.contact ? '*'.repeat(6) + item.contact.slice(6) : 'N/A'}
        </Text>

        <TouchableOpacity
          onPress={() => handleReadMore(item.id)}
          style={styles.readMoreButton}
        >
          <Ionicons
            name={expandedRowId === item.id ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#003961"
          />
        </TouchableOpacity>

        {Number(!leadStatus) == 0 && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('UpdateScreen', { userSearchdata: item.id })
            }
            style={styles.updateButton}
          >
            <Ionicons name="create-outline" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.desigedtext}>
        <Text style={styles.extraText}><View style={styles.widthadd}><Text >Project</Text><Text>:{item.form_name} </Text></View></Text>
        <Text style={styles.extraText}><View style={styles.widthadd}><Text >Entry Date</Text><Text>:{item.entry_date}</Text></View></Text>
        <Text style={styles.extraText}><View style={styles.widthadd}><Text >Last Assigned</Text><Text>:{item.assign_time}</Text></View></Text>
        <Text style={styles.extraText}><View style={styles.widthadd}><Text >Lead Source</Text><Text>:{item.lead_source}</Text></View></Text>
        <Text style={styles.extraText}><View style={styles.widthadd}><Text >Agent</Text><Text>:{item.agent}</Text></View></Text>
      </View>

      {expandedRowId === item.id && (
        <View style={styles.detailedInfo}>
          <Text style={styles.extraText}>Name: {item.name}</Text>
          <Text style={styles.extraText}>Project: {item.form_name}</Text>
          <Text style={styles.extraText}>Agent: {item.agent}</Text>
          <Text style={styles.extraText}>Entry Date: {item.entry_date}</Text>
          <Text style={styles.extraText}>Last Assigned: {item.assign_time}</Text>
          <Text style={styles.extraText}>Lead Source: {item.lead_source}</Text>
          <Text style={styles.extraText}>Phone Number: {item.contact}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
    

      <TextInput
        placeholder="Search by name, contact, project, agent"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
        placeholderTextColor="#000"
      />
      <View style={styles.picker}>
        <Text>
          All Agents
        </Text>
      </View>
     

      {loading ? (
        <ActivityIndicator size="large" color="#003961" style={{ marginTop: 20 }} />
      ) : (
     <FlatList
  data={filteredData}
  keyExtractor={(item) => item.id.toString()}
  renderItem={renderItem}
/>


      )}
      <View style={styles.pagination}>
  <TouchableOpacity
    onPress={handlePrev}
    disabled={page === 1}
    style={[
      styles.btn,
      page === 1 && styles.disabledBtn
    ]}
  >
    <Text style={styles.btnText}>Previous</Text>
  </TouchableOpacity>

  <Text style={styles.pageText}>
    Page {page} of {lastPage}
  </Text>

  <TouchableOpacity
    onPress={handleNext}
    disabled={page === lastPage}
    style={[
      styles.btn,
      page === lastPage && styles.disabledBtn
    ]}
  >
    <Text style={styles.btnText}>Next</Text>
  </TouchableOpacity>
</View>
    </View>
    
  );
};

export default HomeTableList;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f1f1', padding: 10 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#003961',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  widthadd: {
    display: "flex",
    flexDirection: "row",
    // justifyContent: "space-evenly"
  },
  backButton: { marginRight: 10 },
  headerText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  searchInput: {
    height: 40,

    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  picker: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'column',
    elevation: 3,
    backgroundColor: '#fff',
    padding: 15,
    margin: 5,
    borderRadius: 10,
    alignItems: 'left',
  },
  firstdata: {
    flexDirection: 'row',
    alignItems: 'center',

    borderBottomWidth: 1,
    flexWrap: 'wrap',
  },
  cell: { flex: 1, fontSize: 14, textAlign: 'center', padding: 5 },
  readMoreButton: { padding: 10 },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  detailedInfo: {
    backgroundColor: '#f3f3f3',
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
    width: '100%',
  },
  extraText: { fontSize: 14, color: '#333', marginBottom: 5, textAlign: "left" },
 
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    
  },
  btn: {
   backgroundColor: "#003961",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
     marginBottom:40
  },
  disabledBtn: {
    backgroundColor: '#ccc',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  pageText: {
    fontWeight: '600',
  },

});
