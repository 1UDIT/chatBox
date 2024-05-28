"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import { getAnswer } from '../chat/action'

export default function page() {
    const [chatNow, setChatNow] = useState('')
    const [generation, setGeneration] = useState<string>('');
    return (
        <div className='grid grid-rows-3 grid-flow-col gap-4 h-screen'>
            <div className='h-32 w-80 rounded border border-rose-500 m-auto'>
                <span>Chat Now</span>
                <Input placeholder='Enter Chat' onChange={(e) => setChatNow(e.target.value)} value={chatNow} />
            </div>
            <div className='w-80 pl-5'>
                <span>Suggestion</span>
                
            </div>
            <div className='w-80  m-auto'>
                <span>Suggestion</span>
                <button
                    onClick={async () => {
                        const { text } = await getAnswer('Why is the sky blue?');
                        setGeneration(text);
                    }}
                >
                    Answer
                </button>
                <div>{generation}</div>
            </div>
        </div>
    )
}
