import { Button } from 'components';
import { axiosInstance } from 'config';
import React, { useEffect, useState } from 'react';

type previousSessionsType = {
  user_id: string,
  id: string,
  hint: string
  timestamp: string
}

type propsType = {
  updatePreviousSessions: number
  updateSession: (id: string) => void
}

export const PreviousSessions = ({ updatePreviousSessions, updateSession }: propsType) => {

  const [previousSessions, setPreviousSessions] = useState<previousSessionsType[]>([]);

  const getPrevSessions = async () => {
    const sessionsRes = await axiosInstance.get('sessions');
    console.log(JSON.stringify(sessionsRes.data))
    localStorage.setItem('session', JSON.stringify(sessionsRes.data))
    if (sessionsRes.data) {
      setPreviousSessions(sessionsRes.data);
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token') && updatePreviousSessions!=0) { 
      getPrevSessions() 
    }
  }, [updatePreviousSessions])

  return (
    <div className="bg-white h-screen w-52 flex flex-col p-4 fixed top-0">
      <h2 className="text-lg font-bold mb-4">Previous Sessions</h2>
      <Button color='black' className='mb-4' onClick={() => updateSession('')}>New Session</Button>
      {previousSessions.map(session => (
        <div key={session.id} className="flex items-center py-2 cursor-pointer p-3 my-6" onClick={() => updateSession(session.id)}>
          <div className="w-4 h-4 bg-black rounded-full mr-2"></div>
          <div>
            <p className="text-sm font-semibold">{session.hint}</p>
            <p className="text-xs text-gray-500">{session.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

