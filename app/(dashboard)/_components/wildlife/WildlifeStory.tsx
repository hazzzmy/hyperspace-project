"use client"

import { useEffect } from 'react';
import { Separator } from "@/components/ui/separator"
import { WildlifeType } from '@/types';
import { capitalize } from '@/lib/utils';

interface WildLifeStoryProps {
    data: WildlifeType;
    activeChapter: string;
    setActiveChapter: (chapterId: string) => void;
}

const WildLifeStory: React.FC<WildLifeStoryProps> = ({ data, activeChapter, setActiveChapter }) => {

    useEffect(() => {
        const container = document.getElementById("features");
    
        const onScroll = () => {
            const element = document.getElementById(data.location);
            if (element && container) {
                const bounds = element.getBoundingClientRect();
                const containerBounds = container.getBoundingClientRect();
                
                if (
                    bounds.top < containerBounds.bottom &&
                    bounds.bottom > containerBounds.top
                ) {
                    setActiveChapter(data.location);
                }
            }
        };
    
        if (container) {
            container.addEventListener('scroll', onScroll);
        }
    
        return () => {
            if (container) {
                container.removeEventListener('scroll', onScroll);
            }
        };
    }, [data.location, setActiveChapter]);
    

    return (
        <section
            id={data.location}
            className={`flex flex-col h-[80vh] justify-between  bg-cover bg-no-repeat ${data.location === activeChapter ? 'active' : ''}`}
            style={{ backgroundImage: `url('/${data.location}.jpg')`}}
        >   
            <div className='flex flex-col gap-4 h-full justify-center p-6 m-0' style={{ backgroundImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.1))' }}>
                <h1 className="text-2xl font-bold">{capitalize(data.location)}</h1>
                <p>{data.description}</p>
            </div>
            <Separator orientation="horizontal"/>
        </section>
    );
};

export default WildLifeStory;
