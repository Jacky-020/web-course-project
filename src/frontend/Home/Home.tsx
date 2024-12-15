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
        const fetchVideo = async () => {
            const response = await fetch('/day-and-night.mp4');
            const arrayBuffer = await response.arrayBuffer();

            const canvas = canvasRef.current;
            if (!canvas) return;
            const context = canvas.getContext('2d');
            if (!context) return;

            const decoder = new VideoDecoder({
                output: (frame) => {
                    if (context) {
                        context.drawImage(frame, 0, 0, canvas.width, canvas.height);
                        frame.close();
                    }
                },
                error: (e) => console.error(e),
            });

            const video = MP4Box.createFile();
            video.start();
            video.onError = (e: Error) => {
                console.log(e);
            };
            video.onReady = (info) => {
                const track = info.videoTracks[0];
                const stream = new MP4Box.DataStream(undefined, 0, MP4Box.DataStream.BIG_ENDIAN);
                video.getTrackById(track.id).mdia.minf.stbl.stsd.entries[0].avcC.write(stream);
                video.setExtractionOptions(track.id);
                decoder.configure({
                    codec: track.codec,
                    codedHeight: track.video.height,
                    codedWidth: track.video.width,
                    description: new Uint8Array(stream.buffer, 8),
                });
                video.start();
            };
            video.onSamples = function (id, user, samples) {
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

            arrayBuffer.fileStart = 0;
            video.appendBuffer(arrayBuffer);
            video.flush();
        };

        fetchVideo();
    }, []);

    return <canvas ref={canvasRef} width="640" height="360"></canvas>;
};

export default Home;
