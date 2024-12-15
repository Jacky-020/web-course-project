import React, { useEffect, useRef, useState } from 'react';
import styles from './Home.module.css';
import { useTheme } from '../Theme/ThemeProviderHooks';
import MP4Box from 'mp4box';

const sectionSize = 2 * 25 + 13;
const frames = 25;

const total = sectionSize * 3;

interface Segment {
    start: number;
    end: number;
}

const day: Segment = {
    start: 0,
    end: sectionSize,
};

const transition: Segment = {
    start: sectionSize + 1,
    end: sectionSize * 2,
};

const night: Segment = {
    start: sectionSize * 2 + 1,
    end: sectionSize * 3,
};

const Home: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const getFrames = async () => {
            const frames: ImageBitmap[] = [];
            const response = await fetch('/day-and-night.mp4');
            const arrayBuffer = await response.arrayBuffer();

            const decoder = new VideoDecoder({
                output: async (frame) => frames.push(await createImageBitmap(frame)),
                error: (e) => console.error(e),
            });

            const video = MP4Box.createFile();
            video.start();
            video.onError = (e: Error) => {
                console.log(e);
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            video.onReady = (info: any) => {
                const track = info.videoTracks[0];
                const stream = new MP4Box.DataStream(undefined, 0, MP4Box.DataStream.BIG_ENDIAN);
                video.getTrackById(track.id).mdia.minf.stbl.stsd.entries[0].avcC.write(stream);
                decoder.configure({
                    codec: track.codec,
                    codedHeight: track.video.height,
                    codedWidth: track.video.width,
                    description: new Uint8Array(stream.buffer, 8),
                });
                video.setExtractionOptions(track.id);
                video.start();
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            video.onSamples = function (_id: any, _user: any, samples: any) {
                for (const sample of samples) {
                    decoder.decode(
                        new EncodedVideoChunk({
                            type: sample.is_sync ? 'key' : 'delta',
                            timestamp: (1e6 * sample.cts) / sample.timescale,
                            duration: (1e6 * sample.duration) / sample.timescale,
                            data: sample.data,
                        }),
                    );
                }
            };

            // @ts-expect-error required for MP4Box
            arrayBuffer.fileStart = 0;
            video.appendBuffer(arrayBuffer);
            video.flush();
            await decoder.flush();
            return frames;
        };

        getFrames();
    }, []);

    return <canvas ref={canvasRef} width="640" height="360"></canvas>;
};

export default Home;
