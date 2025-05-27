import React, { useEffect, useState } from 'react';
import { serverURL } from '../constants';
import axios from 'axios';
import PolicyLayout from '../components/PolicyLayout';

const TermsPolicy = () => {
    const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        if (sessionStorage.getItem('TermsPolicy')) {
          setData(sessionStorage.getItem('TermsPolicy'));
        } else {
            const postURL = serverURL + `/api/policies`;
            const response = await axios.get(postURL);
          const termsData = response.data[0].terms;
          setData(termsData);
          sessionStorage.setItem('TermsPolicy', termsData);
        }
      } catch (error) {
        console.error('Error fetching terms policy:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    }, []);

  return <PolicyLayout title="Terms of Service" content={data} isLoading={loading} />;
};

export default TermsPolicy;
