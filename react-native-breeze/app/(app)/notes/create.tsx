import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import RichTextEditor from '@/components/notes/RichTextEditor';
import { useSession } from '@/context/session';
import { useToast } from '@/context/toast';
import { useCategoriesQuery, useCreateNoteMutation } from '@/features/notes/api';
import type { Category } from '@/features/notes/types';

export default function CreateNoteScreen() {
    const { session } = useSession();
    const { showToast } = useToast();

    const { data: categories } = useCategoriesQuery(session);
    const createMutation = useCreateNoteMutation(session);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);

    const hasContent = title.trim().length > 0 || content.trim().length > 0;

    const handleSave = async () => {
        if (!title.trim()) {
            showToast({ type: 'error', message: 'Please enter a title' });
            return;
        }
        if (!content.trim()) {
            showToast({ type: 'error', message: 'Please enter some content' });
            return;
        }

        try {
            await createMutation.mutateAsync({
                title: title.trim(),
                content: content.trim(),
                category_id: selectedCategory?.id || null,
                note_date: new Date().toISOString().split('T')[0],
            });
            showToast({ type: 'success', message: 'Note created successfully' });
            router.back();
        } catch (error) {
            showToast({ type: 'error', message: 'Failed to create note' });
        }
    };

    const handleBack = () => {
        if (hasContent) {
            Alert.alert('Discard Note?', 'You have unsaved changes. Are you sure you want to discard them?', [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Discard',
                    style: 'destructive',
                    onPress: () => router.back(),
                },
            ]);
        } else {
            router.back();
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`} edges={['top']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={tw`flex-1`}
            >
                {/* Header */}
                <View style={tw`flex-row items-center justify-between px-4 py-3 border-b border-gray-100`}>
                    <TouchableOpacity onPress={handleBack} style={tw`p-2`}>
                        <Ionicons name="close" size={24} color="#374151" />
                    </TouchableOpacity>
                    <Text style={tw`text-lg font-semibold text-gray-800`}>New Note</Text>
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={createMutation.isPending}
                        style={tw`p-2`}
                    >
                        {createMutation.isPending ? (
                            <ActivityIndicator size="small" color="#14B8A6" />
                        ) : (
                            <Text style={tw`text-teal-500 font-semibold`}>Save</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <ScrollView style={tw`flex-1 px-4`} keyboardShouldPersistTaps="handled">
                    {/* Title */}
                    <TextInput
                        style={tw`text-3xl font-bold text-gray-800 mt-4 mb-2`}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Note title"
                        placeholderTextColor="#9CA3AF"
                        autoFocus
                    />

                    {/* Category Selector */}
                    <TouchableOpacity
                        onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                        style={tw`flex-row items-center mb-4 py-2`}
                    >
                        <Ionicons name="folder-outline" size={18} color="#6B7280" />
                        <Text style={tw`ml-2 text-gray-600`}>
                            {selectedCategory ? selectedCategory.name : 'Select category'}
                        </Text>
                        <Ionicons
                            name={showCategoryPicker ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color="#6B7280"
                            style={tw`ml-1`}
                        />
                    </TouchableOpacity>

                    {/* Category Picker Dropdown */}
                    {showCategoryPicker && categories && (
                        <View style={tw`mb-4 bg-gray-50 rounded-xl p-2`}>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedCategory(null);
                                    setShowCategoryPicker(false);
                                }}
                                style={tw`py-2 px-3 rounded-lg ${!selectedCategory ? 'bg-white' : ''}`}
                            >
                                <Text style={tw`text-gray-700`}>No category</Text>
                            </TouchableOpacity>
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category.id}
                                    onPress={() => {
                                        setSelectedCategory(category);
                                        setShowCategoryPicker(false);
                                    }}
                                    style={tw`py-2 px-3 rounded-lg flex-row items-center ${selectedCategory?.id === category.id ? 'bg-white' : ''
                                        }`}
                                >
                                    <View
                                        style={[tw`w-3 h-3 rounded-full mr-2`, { backgroundColor: category.color }]}
                                    />
                                    <Text style={tw`text-gray-700`}>{category.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </ScrollView>

                {/* Rich Text Editor with integrated toolbar */}
                <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Start writing your note..."
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
