import { Dispatch, SetStateAction} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface PickerProps<T> {
    options: T[];
    picked: T;
    setPicked: Dispatch<SetStateAction<T>>;
    renderOption?: (option: T) => React.ReactNode;
}

export default function Picker<T extends string | number>({ options, picked, setPicked, renderOption, }: PickerProps<T>) {
    return (
        <View style={{ flex: 1, padding: 10 }}>
            {options.map((option) => (
                <TouchableOpacity
                    key={String(option)}
                    style={{
                        padding: 10,
                        backgroundColor: picked === option ? '#d3d3d3' : '#fff',
                        borderRadius: 5,
                        marginVertical: 5,
                    }}
                    onPress={() => setPicked(option)}
                >
                    <Text>
                        {renderOption ? renderOption(option) : String(option)}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}
