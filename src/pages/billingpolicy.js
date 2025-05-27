import React, { useEffect, useState } from 'react';
import { serverURL } from '../constants';
import axios from 'axios';
import PolicyLayout from '../components/PolicyLayout';

const BillingPolicy = () => {
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
            const postURL = serverURL + `/api/policies`;
            const response = await axios.get(postURL);
        setData(response.data[0].billing);
      } catch (error) {
        console.error('Error fetching billing policy:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    }, []);

  return <PolicyLayout title="Subscription & Billing Policy" content={data} isLoading={loading} />;
};

export default BillingPolicy;
