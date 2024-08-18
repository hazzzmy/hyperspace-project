import { promises as fs } from 'fs';
import path from 'path';
import { z } from "zod";
import { NextRequest } from 'next/server';

const reqContent = z.object({
    content: z.string()
});

export async function GET(request: NextRequest, { params }: { params: { content: string } }) {
    const content = params.content;
    
    const queryParams = reqContent.safeParse({
        content: content || undefined,
    });

    if (!queryParams.success) {
        return new Response(JSON.stringify({ error: queryParams.error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    const { content: parsedContent } = queryParams.data;
    const jsonDirectory = path.join(process.cwd(), 'app/data');
    const fileContents = await fs.readFile(jsonDirectory + `/${parsedContent}.json`, 'utf8');

    let parsedFileContents;
    try {
        parsedFileContents = JSON.parse(fileContents);
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error parsing JSON' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify(parsedFileContents), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
