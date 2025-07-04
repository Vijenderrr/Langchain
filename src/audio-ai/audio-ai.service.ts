import { Injectable } from '@nestjs/common';
import { createReadStream, writeFileSync } from 'fs';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AudioAiService {
    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    /**
     * Transcribe English audio to text using Whisper
     */
    async createTranscription(): Promise<string> {
        const response = await this.openai.audio.transcriptions.create({
            file: createReadStream('AudioSample.m4a'), // Ensure this file exists
            model: 'whisper-1',
            language: 'en',
        });

        console.log('Transcription Result:', response.text);
        return response.text;
    }

    /**
     * Translate non-English audio to English text using Whisper
     */
    async translate(): Promise<string> {
        const response = await this.openai.audio.translations.create({
            file: createReadStream('audio1.mp3'), // Provide non-English audio file
            model: 'whisper-1',
        });

        console.log('Translation Result:', response.text);
        return response.text;
    }

    /**
     * Convert a given text to high-quality spoken audio
     */
    async textToSpeech(): Promise<string> {
        const inputText = `I snapped a pic of my chaos, caught a moment in time on my iPhone,
Packed my bags, ready to roll, but you know I'm feeling like the GOAT now, gotta show it,
Yeah, yeah, yeah, yeah, gotta show it,
Yeah, yeah, yeah, yeah, watch me flow it.

Didn't stick around for Kheechri, just sipped some tea, that Kheechri Thai,
Who wrapped me up with bandages? I’m from the North-East, no alibis,
No rice in my meals, I stand tall, never short, that's no disguise,
Parked my ride outside NCG’s gate, she came out, searching with those eyes.

She brought a girl, two clashes on the streets,
We both fought, but the world didn’t see,
Baby at home’s wondering where I be,
But girl, that one you saw, her life’s luxury.

She’s all about fine dining, parties all night,
Just like the rest, she hides a tattoo out of sight,
You might get the hint when you glance at my wrist,
But the other one’s hidden, somewhere deep in the mist.

It's written: "Bite me, fight me, ride me, ignite me,"
Kawa, Sakhi, Kathy, they’re all beside me,
Lonely but dangerous, dicey, precise,
I send the man out to sleep while you stay nice.

She never came home, Sultan climbed all night,
I grabbed a pen, wrote down my might,
Ain't no point raising dogs that beg in the cold,
Real ones don't need the market’s toys or gold.

No fake friendships, only bonds that rise,
No point in rapping fast if your tongue's tied,
If you can’t grasp life, money, love or pain,
Then stepping to the mic will only end in shame.

We strip down bare, dance with death in sight,
We sit and grind, feeding the fire, no flight,
Drinking till the end, mic in hand, coughing beats,
Rolling deep, bro’s hand shaping the heat.

Made the streets my canvas, highways too,
Fat stacks coming in, all from what I drew,
Rappers make a year’s worth from one khaki hue,
What the fuck, now who’s calling through?`

        const response = await this.openai.audio.speech.create({
            input: inputText,
            voice: 'onyx',       // Other voices: alloy, echo, fable, nova, shimmer
            model: 'tts-1',
            response_format: 'mp3',
        });

        const buffer = Buffer.from(await response.arrayBuffer());
        writeFileSync('output.mp3', buffer);
        console.log('Audio saved as output.mp3');

        return 'output.mp3';
    }
}
