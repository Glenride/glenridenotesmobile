import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import {
    useCategoriesQuery,
    useDeleteNoteMutation,
    useNoteQuery,
    useUpdateNoteMutation,
} from '@/features/notes/api';

export default function NoteDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const noteId = parseInt(id, 10);
    const { session } = useSession();
    const { showToast } = useToast();

    const { data: note, isLoading } = useNoteQuery(noteId, session);
    const { data: categories } = useCategoriesQuery(session);
    const updateMutation = useUpdateNoteMutation(session);
    const deleteMutation = useDeleteNoteMutation(session);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
            setIsFavorite(note.is_favorite);
        }
    }, [note]);

    // Track changes
    useEffect(() => {
        if (note) {
            setHasChanges(
                title !== note.title ||
                content !== note.content ||
                isFavorite !== note.is_favorite
            );
        }
    }, [title, content, isFavorite, note]);

    const handleSave = async () => {
        if (!hasChanges) return;

        try {
            await updateMutation.mutateAsync({
                id: noteId,
                data: { title, content, is_favorite: isFavorite },
            });
            showToast({ type: 'success', message: 'Note saved successfully' });
            setHasChanges(false);
        } catch (error) {
            showToast({ type: 'error', message: 'Failed to save note' });
        }
    };

    const handleDelete = () => {
        Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteMutation.mutateAsync(noteId);
                        showToast({ type: 'success', message: 'Note deleted' });
                        router.back();
                    } catch (error) {
                        showToast({ type: 'error', message: 'Failed to delete note' });
                    }
                },
            },
        ]);
    };

    const handleBack = () => {
        if (hasChanges) {
            Alert.alert('Unsaved Changes', 'Do you want to save your changes?', [
                {
                    text: 'Discard',
                    style: 'destructive',
                    onPress: () => router.back(),
                },
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Save',
                    onPress: async () => {
                        await handleSave();
                        router.back();
                    },
                },
            ]);
        } else {
            router.back();
        }
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    if (isLoading) {
        return (
            <SafeAreaView style={tw`flex-1 bg-white`}>
                <View style={tw`flex-1 items-center justify-center`}>
                    <ActivityIndicator size="large" color="#14B8A6" />
                </View>
            </SafeAreaView>
        );
    }

    if (!note) {
        return (
            <SafeAreaView style={tw`flex-1 bg-white`}>
                <View style={tw`flex-1 items-center justify-center`}>
                    <Text style={tw`text-gray-500`}>Note not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-white`} edges={['top']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={tw`flex-1`}
            >
                {/* Header */}
                <View style={tw`flex-row items-center justify-between px-4 py-3`}>
                    <TouchableOpacity onPress={handleBack} style={tw`p-2`}>
                        <Ionicons name="arrow-back" size={24} color="#374151" />
                    </TouchableOpacity>
                    <View style={tw`flex-row items-center`}>
                        <TouchableOpacity style={tw`p-2`}>
                            <Ionicons name="bookmark-outline" size={22} color="#374151" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleFavorite} style={tw`p-2`}>
                            <Ionicons
                                name={isFavorite ? 'heart' : 'heart-outline'}
                                size={22}
                                color={isFavorite ? '#EF4444' : '#374151'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={tw`p-2`}>
                            <Ionicons name="share-outline" size={22} color="#374151" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} style={tw`p-2`}>
                            <Ionicons name="trash-outline" size={22} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content */}
                <ScrollView style={tw`flex-1 px-4`} keyboardShouldPersistTaps="handled">
                    {/* Title */}
                    <TextInput
                        style={tw`text-3xl font-bold text-gray-800 mt-4 mb-2`}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Note title"
                        placeholderTextColor="#9CA3AF"
                    />

                    {/* Category label */}
                    {note.category && (
                        <Text style={tw`text-sm text-gray-500 mb-4`}>
                            Category: {note.category.name}
                        </Text>
                    )}
                </ScrollView>

                {/* Rich Text Editor with integrated toolbar */}
                <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Start writing..."
                />

                {/* Save button - only show when there are changes */}
                {hasChanges && (
                    <TouchableOpacity
                        style={tw`mx-4 mb-4 py-3 bg-teal-500 rounded-xl items-center`}
                        onPress={handleSave}
                        disabled={updateMutation.isPending}
                    >
                        {updateMutation.isPending ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={tw`text-white font-semibold text-base`}>Save Changes</Text>
                        )}
                    </TouchableOpacity>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
