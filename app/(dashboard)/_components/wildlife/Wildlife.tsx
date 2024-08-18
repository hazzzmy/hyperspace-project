"use client";

import { useEffect} from "react";

import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import WildLifeStory from "./WildlifeStory";
import { WildlifeType } from "@/types";


interface WildlifeProps {
    activeChapter: string;
    onDataChange: (data: WildlifeType[]) => void;
    setActiveChapter: (chapterId: string) => void;
}


const Wildlife: React.FC<WildlifeProps> = ({ activeChapter, onDataChange, setActiveChapter}) => {
    const dataQuery = useQuery({
        queryKey: ["content", "wildlife"],
        queryFn: async () => {
            const url = `/api/content/wildlife`

            const response = await fetch(
                url
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            return response.json() as Promise<any>;
        },
    });


    useEffect(() => {
        if (dataQuery.data) {
            onDataChange(dataQuery.data)
        }
    }, [dataQuery.data])




    if (dataQuery.isLoading) {
        return (
            <SkeletonWrapper isLoading={true}>
                <div className="h-full mt-4">Loading...</div>
            </SkeletonWrapper>
        );
    }

    if (dataQuery.error) {
        return <div>Error: {dataQuery.error.message}</div>;
    }

    return (
        <SkeletonWrapper isLoading={false}>
            <div className="h-[70vh] mt-2 bg-[rgba(50,50,50,0.8)] rounded p-2">
                <div id="features" className="h-full w-full overflow-y-scroll">
                    {dataQuery.data.map((story: any, index: number) => (
                        <WildLifeStory
                            key={index}
                            data={story}
                            activeChapter={activeChapter}
                            setActiveChapter={setActiveChapter}
                            />
                    ))}
                </div>
            </div>
        </SkeletonWrapper>
    )
}

export default Wildlife