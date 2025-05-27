import React, { useEffect, useState } from 'react';
import { serverURL } from '../constants';
import axios from 'axios';
import PolicyLayout from '../components/PolicyLayout';

const RefundPolicy = () => {
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
            const postURL = serverURL + `/api/policies`;
            const response = await axios.get(postURL);
        setData(response.data[0].refund);
      } catch (error) {
        console.error('Error fetching refund policy:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    }, []);

  return <PolicyLayout title="Refund Policy" content={data} isLoading={loading} />;
};

export default RefundPolicy;
