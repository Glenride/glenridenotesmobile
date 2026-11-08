import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import CategoryFilter from '@/components/notes/CategoryFilter';
import DatePicker from '@/components/notes/DatePicker';
import NoteCard from '@/components/notes/NoteCard';
import { useSession } from '@/context/session';
import { useCategoriesQuery, useNotesQuery } from '@/features/notes/api';
import type { Note } from '@/features/notes/types';

export default function NotesScreen() {
    const { session } = useSession();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Get date range for the week
    const getWeekRange = (date: Date) => {
        const startOfWeek = new Date(date);
        const day = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate() - day);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return {
            start_date: startOfWeek.toISOString().split('T')[0],
            end_date: endOfWeek.toISOString().split('T')[0],
        };
    };

    const weekRange = getWeekRange(selectedDate);

    const {
        data: notes,
        isLoading: notesLoading,
        refetch: refetchNotes,
        isRefetching,
    } = useNotesQuery(
        {
            ...weekRange,
            category_id: selectedCategoryId || undefined,
            search: searchQuery || undefined,
        },
        session
    );

    const { data: categories, isLoading: categoriesLoading } = useCategoriesQuery(session);

    const handleNotePress = (note: Note) => {
        router.push(`/notes/${note.id}`);
    };

    const handleCreateNote = () => {
        router.push('/notes/create');
    };

    if (notesLoading || categoriesLoading) {
        return (
            <SafeAreaView style={tw`flex-1 bg-white`}>
                <View style={tw`flex-1 items-center justify-center`}>
                    <ActivityIndicator size="large" color="#14B8A6" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-white`} edges={['top']}>
            {/* Search Bar with notification icon */}
            <View style={tw`flex-row items-center mx-4 mt-2 mb-4`}>
                <View style={tw`flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-2.5`}>
                    <Ionicons name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        style={tw`flex-1 ml-2 text-gray-800`}
                        placeholder="Search for notes"
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity style={tw`ml-3 p-2`}>
                    <Ionicons name="notifications-outline" size={24} color="#374151" />
                </TouchableOpacity>
            </View>

            {/* Date Picker */}
            <DatePicker selectedDate={selectedDate} onDateSelect={setSelectedDate} />

            {/* Category Filter */}
            <CategoryFilter
                categories={categories || []}
                selectedCategoryId={selectedCategoryId}
                onSelect={setSelectedCategoryId}
            />

            {/* Notes List */}
            <ScrollView
                style={tw`flex-1 px-4`}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetchNotes}
                        tintColor="#14B8A6"
                    />
                }
            >
                {notes && notes.length > 0 ? (
                    <View style={tw`flex-row flex-wrap justify-between`}>
                        {/* Render notes in a masonry-like grid */}
                        <View style={tw`w-[48%]`}>
                            {notes
                                .filter((_, index) => index % 2 === 0)
                                .map((note) => (
                                    <NoteCard key={note.id} note={note} onPress={handleNotePress} />
                                ))}
                        </View>
                        <View style={tw`w-[48%]`}>
                            {notes
                                .filter((_, index) => index % 2 !== 0)
                                .map((note) => (
                                    <NoteCard key={note.id} note={note} onPress={handleNotePress} />
                                ))}
                        </View>
                    </View>
                ) : (
                    <View style={tw`items-center justify-center py-20`}>
                        <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
                        <Text style={tw`text-gray-400 mt-4 text-center`}>
                            No notes found for this week
                        </Text>
                        <Text style={tw`text-gray-400 text-sm text-center mt-1`}>
                            Tap the + button to create your first note
                        </Text>
                    </View>
                )}
                <View style={tw`h-20`} />
            </ScrollView>

            {/* FAB - Create Note */}
            <TouchableOpacity
                style={tw`absolute bottom-6 right-6 w-14 h-14 bg-gray-800 rounded-full items-center justify-center shadow-lg`}
                onPress={handleCreateNote}
            >
                <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}
