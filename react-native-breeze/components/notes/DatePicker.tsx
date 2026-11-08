import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

interface DatePickerProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
}

export default function DatePicker({
    selectedDate,
    onDateSelect,
}: DatePickerProps) {
    // Get the week dates centered around the selected date
    const getWeekDates = () => {
        const dates: Date[] = [];
        const startOfWeek = new Date(selectedDate);
        const day = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate() - day); // Start from Sunday

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const weekDates = getWeekDates();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const isSelected = (date: Date) => {
        return date.toDateString() === selectedDate.toDateString();
    };

    const isToday = (date: Date) => {
        return date.toDateString() === new Date().toDateString();
    };

    return (
        <View style={tw`mb-4`}>
            {/* Week dates - compact design matching mockup */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={tw`px-4`}
            >
                {weekDates.map((date, index) => {
                    const selected = isSelected(date);
                    const today = isToday(date);

                    return (
                        <TouchableOpacity
                            key={date.toISOString()}
                            onPress={() => onDateSelect(date)}
                            style={[
                                tw`items-center mx-2 px-3 py-3 rounded-xl min-w-[52px]`,
                                selected && tw`bg-teal-500`,
                                !selected && today && tw`bg-gray-100`,
                            ]}
                        >
                            {/* Day abbreviation */}
                            <Text
                                style={[
                                    tw`text-xs font-medium mb-1`,
                                    selected ? tw`text-teal-100` : tw`text-gray-400`,
                                ]}
                            >
                                {dayNames[index]}
                            </Text>

                            {/* Date number */}
                            <Text
                                style={[
                                    tw`text-xl font-bold`,
                                    selected ? tw`text-white` : tw`text-gray-800`,
                                ]}
                            >
                                {date.getDate()}
                            </Text>

                            {/* Month abbreviation */}
                            <Text
                                style={[
                                    tw`text-xs mt-1`,
                                    selected ? tw`text-teal-100` : tw`text-gray-400`,
                                ]}
                            >
                                {monthNames[date.getMonth()]}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

