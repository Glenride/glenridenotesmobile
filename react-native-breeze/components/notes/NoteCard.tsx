import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

import type { Note } from '@/features/notes/types';

interface NoteCardProps {
    note: Note;
    onPress: (note: Note) => void;
}

export default function NoteCard({ note, onPress }: NoteCardProps) {
    // Get background color from category or default to cream
    const backgroundColor = note.category?.color || '#FFFACD';

    // Extract first few lines for preview
    const getPreview = (content: string, maxLines: number = 5) => {
        const lines = content.split('\n').filter((line) => line.trim());
        return lines.slice(0, maxLines);
    };

    const previewLines = getPreview(note.content);

    return (
        <TouchableOpacity
            onPress={() => onPress(note)}
            style={[
                tw`rounded-2xl p-4 mb-4`,
                {
                    backgroundColor,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    elevation: 3,
                },
            ]}
            activeOpacity={0.8}
        >
            {/* Title */}
            <Text
                style={tw`text-base font-bold text-gray-900 mb-3`}
                numberOfLines={2}
            >
                {note.title}
            </Text>

            {/* Content preview as numbered/bulleted list */}
            <View style={tw`gap-1`}>
                {previewLines.map((line, index) => (
                    <View key={index} style={tw`flex-row items-start`}>
                        <Text style={tw`text-gray-600 text-sm w-5`}>
                            {index + 1}.
                        </Text>
                        <Text
                            style={tw`text-gray-700 text-sm flex-1 leading-5`}
                            numberOfLines={2}
                        >
                            {line.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '')}
                        </Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );
}

