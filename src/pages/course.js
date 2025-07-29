
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Course = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/api/courses/${id}`);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return <div>Loading content...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
      {course.topics.map((topic, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{topic.title}</h2>
          <p className="text-gray-700">{topic.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Course;
