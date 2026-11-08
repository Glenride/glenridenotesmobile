import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useCallback } from 'react';
import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native';
import {
    RichEditor,
    RichToolbar,
    actions,
} from 'react-native-pell-rich-editor';
import tw from 'twrnc';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder = 'Start writing...',
    autoFocus = false,
}: RichTextEditorProps) {
    const richText = useRef<RichEditor>(null);

    const handleBold = useCallback(() => {
        richText.current?.sendAction(actions.setBold, 'result');
    }, []);

    const handleItalic = useCallback(() => {
        richText.current?.sendAction(actions.setItalic, 'result');
    }, []);

    const handleUnderline = useCallback(() => {
        richText.current?.sendAction(actions.setUnderline, 'result');
    }, []);

    const handleStrikethrough = useCallback(() => {
        richText.current?.sendAction(actions.setStrikethrough, 'result');
    }, []);

    const handleHighlight = useCallback(() => {
        richText.current?.sendAction(actions.hiliteColor, 'result', '#FBBF24');
    }, []);

    const handleBulletList = useCallback(() => {
        richText.current?.sendAction(actions.insertBulletsList, 'result');
    }, []);

    const handleOrderedList = useCallback(() => {
        richText.current?.sendAction(actions.insertOrderedList, 'result');
    }, []);

    const handleCheckList = useCallback(() => {
        richText.current?.sendAction(actions.checkboxList, 'result');
    }, []);

    return (
        <View style={tw`flex-1`}>
            {/* Rich Text Editor */}
            <RichEditor
                ref={richText}
                style={tw`flex-1 min-h-80`}
                initialContentHTML={value}
                onChange={onChange}
                placeholder={placeholder}
                initialFocus={autoFocus}
                editorStyle={{
                    backgroundColor: '#FFFFFF',
                    color: '#374151',
                    placeholderColor: '#9CA3AF',
                    contentCSSText: `
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                        font-size: 16px;
                        line-height: 1.5;
                        padding: 0;
                    `,
                }}
                useContainer={false}
            />

            {/* Custom Dark Formatting Toolbar - matching mockup design */}
            <View
                style={tw`flex-row items-center justify-center px-4 py-3 bg-gray-900 rounded-t-2xl`}
            >
                {/* Bold */}
                <TouchableOpacity style={tw`p-3 mx-1`} onPress={handleBold}>
                    <Text style={tw`text-lg font-bold text-white`}>B</Text>
                </TouchableOpacity>

                {/* Italic */}
                <TouchableOpacity style={tw`p-3 mx-1`} onPress={handleItalic}>
                    <Text style={tw`text-lg italic text-white`}>I</Text>
                </TouchableOpacity>

                {/* Underline */}
                <TouchableOpacity style={tw`p-3 mx-1`} onPress={handleUnderline}>
                    <Text style={tw`text-lg underline text-white`}>U</Text>
                </TouchableOpacity>

                {/* Strikethrough */}
                <TouchableOpacity style={tw`p-3 mx-1`} onPress={handleStrikethrough}>
                    <Text style={tw`text-lg text-white line-through`}>T</Text>
                </TouchableOpacity>

                <View style={tw`w-px h-5 bg-gray-600 mx-2`} />

                {/* Highlight */}
                <TouchableOpacity
                    style={tw`p-2 mx-1 bg-yellow-400 rounded`}
                    onPress={handleHighlight}
                >
                    <Ionicons name="color-fill" size={18} color="#1F2937" />
                </TouchableOpacity>

                <View style={tw`w-px h-5 bg-gray-600 mx-2`} />

                {/* Bullet List */}
                <TouchableOpacity style={tw`p-3 mx-1`} onPress={handleBulletList}>
                    <Ionicons name="list" size={18} color="white" />
                </TouchableOpacity>

                {/* Ordered List */}
                <TouchableOpacity style={tw`p-3 mx-1`} onPress={handleOrderedList}>
                    <Ionicons name="reorder-three" size={18} color="white" />
                </TouchableOpacity>

                {/* Check List */}
                <TouchableOpacity style={tw`p-3 mx-1`} onPress={handleCheckList}>
                    <Ionicons name="checkbox-outline" size={18} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
