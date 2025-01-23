import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator, SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/reducers";
import { addTodo } from "@/store/reducers/todoSlice";
import { MaterialIcons } from "@expo/vector-icons";

interface Todo {
  id: number;
  task: string;
}

const MyComponent = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const [newTask, setNewTask] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddTodo = () => {
    try {
      if (!newTask.trim()) {
        Alert.alert("Error", "Please enter a task");
        return;
      }

      setIsLoading(true);
      const newTodo = { id: Date.now(), task: newTask.trim() };
      dispatch(addTodo(newTodo));
      setNewTask("");
      Alert.alert("Success", "Task added successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to add task. Please try again.");
      console.error("Add todo error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <MaterialIcons name="check-circle-outline" size={24} color="#6B7280" />
      <Text style={styles.todoText}>{item.task}</Text>
    </View>
  );

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="assignment" size={50} color="#9CA3AF" />
      <Text style={styles.emptyText}>No tasks yet</Text>
      <Text style={styles.emptySubText}>Add a new task to get started</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>To-Do List</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={newTask} onChangeText={setNewTask} placeholder="Enter new task" placeholderTextColor="#9CA3AF" />
        <TouchableOpacity
          style={[styles.addButton, !newTask.trim() && styles.disabledButton]}
          onPress={handleAddTodo}
          disabled={!newTask.trim() || isLoading}
        >
          {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <MaterialIcons name="add" size={24} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={EmptyListComponent}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F3F4F6",
  },
  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  input: {
    flex: 1,
    height: 46,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    color: "#1F2937",
    fontSize: 16,
  },
  addButton: {
    width: 46,
    height: 46,
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  todoText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4B5563",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
});

export default MyComponent;
