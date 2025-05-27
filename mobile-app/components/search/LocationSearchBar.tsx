import { useState, useRef, useCallback } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { SearchSuggestion, Region } from "@/types";
import { searchLocations, LocationSearchError, getZoomLevelForLocationType } from "@/services/locationSearchService";
import { debounce } from "@/utils/debounce";
import { showAlert } from "@/utils/alert";

interface LocationSearchBarProps {
  onLocationSelect: (region: Region) => void;
}

export function LocationSearchBar({ onLocationSelect }: LocationSearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const results = await searchLocations(searchQuery, 5);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
        setShowSuggestions(false);

        if (error instanceof LocationSearchError) {
          showAlert("Search Error", error.message, "warning");
        } else {
          showAlert("Search Error", "Unable to search locations. Please try again.", "error");
        }
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleQueryChange = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const handleSearch = () => {
    if (query.trim()) {
      debouncedSearch(query);
    }
    Keyboard.dismiss();
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    setSuggestions([]);
    setIsFocused(false);
    Keyboard.dismiss();

    const zoomLevel = getZoomLevelForLocationType(suggestion.type) || { latitudeDelta: 0.01, longitudeDelta: 0.01 };
    const region: Region = {
      latitude: suggestion.coordinate.latitude,
      longitude: suggestion.coordinate.longitude,
      latitudeDelta: zoomLevel.latitudeDelta,
      longitudeDelta: zoomLevel.longitudeDelta,
    };

    onLocationSelect(region);
  };

  const handleClearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setIsLoading(false);
    inputRef.current?.focus();
  };

  const renderSuggestion = ({ item }: { item: SearchSuggestion }) => (
    <Pressable
      onPress={() => handleSuggestionSelect(item)}
      className={`p-3 border-b border-gray-200 dark:border-gray-700 ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}
      accessibilityRole="button"
      accessibilityLabel={`Select location ${item.title}`}
      accessibilityHint="Tap to navigate to this location on the map"
    >
      <Text className="text-base font-medium text-gray-900 dark:text-white">{item.title}</Text>
      {item.subtitle && (
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.subtitle}</Text>
      )}
    </Pressable>
  );

  return (
    <View className="absolute left-4 right-4 z-10" style={{ top: insets.top + 10 }}>
      <View
        className={`flex-row items-center rounded-xl shadow-lg ${
          isDark ? "bg-gray-800/95" : "bg-white/95"
        }`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <TextInput
          ref={inputRef}
          placeholder="Search locations..."
          placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
          className={`flex-1 px-4 py-3 text-base ${isDark ? "text-white" : "text-gray-900"}`}
          value={query}
          onChangeText={handleQueryChange}
          onSubmitEditing={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          caretHidden={!isFocused}
          accessibilityLabel="Location search input"
          accessibilityHint="Type to search for locations"
        />

        {query.length > 0 && (
          <Pressable
            onPress={handleClearSearch}
            className="p-2 mr-1"
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            accessibilityHint="Clear the search input"
          >
            <IconSymbol name="xmark" size={16} color={isDark ? "#9ca3af" : "#6b7280"} />
          </Pressable>
        )}

        <Pressable
          onPress={handleSearch}
          className="p-3 mr-1"
          accessibilityRole="button"
          accessibilityLabel="Search"
          accessibilityHint="Tap to search for locations"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={isDark ? "#60a5fa" : "#3b82f6"} />
          ) : (
            <IconSymbol name="magnifyingglass" size={20} color={isDark ? "#60a5fa" : "#3b82f6"} />
          )}
        </Pressable>
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View
          className={`mt-1 rounded-xl shadow-lg overflow-hidden ${
            isDark ? "bg-gray-800/95" : "bg-white/95"
          }`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            maxHeight: 200,
          }}
        >
          <FlatList
            data={suggestions}
            renderItem={renderSuggestion}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
}
