import React, { useEffect, useState } from 'react';
import { serverURL } from '../constants';
import axios from 'axios';
import PolicyLayout from '../components/PolicyLayout';

const PrivacyPolicy = () => {
    const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        if (sessionStorage.getItem('PrivacyPolicy')) {
          setData(sessionStorage.getItem('PrivacyPolicy'));
        } else {
            const postURL = serverURL + `/api/policies`;
            const response = await axios.get(postURL);
          const privacyData = response.data[0].privacy;
          setData(privacyData);
          sessionStorage.setItem('PrivacyPolicy', privacyData);
        }
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    }, []);

  return <PolicyLayout title="Privacy Policy" content={data} isLoading={loading} />;
};

export default PrivacyPolicy;

