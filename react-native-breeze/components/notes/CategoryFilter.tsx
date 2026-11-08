import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

import type { Category } from '@/features/notes/types';

interface CategoryFilterProps {
    categories: Category[];
    selectedCategoryId: number | null;
    onSelect: (categoryId: number | null) => void;
}

export default function CategoryFilter({
    categories,
    selectedCategoryId,
    onSelect,
}: CategoryFilterProps) {
    const allCategories = [
        { id: null, name: 'All', color: '#FFFFFF' },
        ...categories.map((c) => ({ id: c.id, name: c.name, color: c.color })),
    ];

    return (
        <View style={tw`mb-4`}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={tw`px-4`}
            >
                {allCategories.map((category) => {
                    const isSelected = selectedCategoryId === category.id;
                    return (
                        <TouchableOpacity
                            key={category.id ?? 'all'}
                            onPress={() => onSelect(category.id)}
                            style={tw`mr-2 px-4 py-2 rounded-full border ${isSelected
                                    ? 'bg-gray-800 border-gray-800'
                                    : 'bg-white border-gray-200'
                                }`}
                        >
                            <Text
                                style={tw`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-700'
                                    }`}
                            >
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}
