import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert
} from "react-native";


const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "http://localhost:8000";


export default function App() {

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");


  const loadTasks = async () => {

    try {

      const response = await fetch(
        `${API_URL}/tasks`
      );

      const data = await response.json();

      setTasks(data);

    } catch (error) {

      console.error(error);

      Alert.alert(
        "Connection Error",
        "Unable to connect to FocusFlow API"
      );
    }
  };


  const createTask = async () => {

    if (!title.trim()) {
      return;
    }

    try {

      await fetch(
        `${API_URL}/tasks`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            title: title,
            description: "",
            priority: "medium"
          })
        }
      );

      setTitle("");

      loadTasks();

    } catch (error) {

      console.error(error);
    }
  };


  const completeTask = async (id) => {

    await fetch(
      `${API_URL}/tasks/${id}/complete`,
      {
        method: "PATCH"
      }
    );

    loadTasks();
  };


  const deleteTask = async (id) => {

    await fetch(
      `${API_URL}/tasks/${id}`,
      {
        method: "DELETE"
      }
    );

    loadTasks();
  };


  useEffect(() => {

    loadTasks();

  }, []);


  return (

    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>
        FocusFlow
      </Text>

      <Text style={styles.subtitle}>
        Get focused. Get things done.
      </Text>


      <View style={styles.inputRow}>

        <TextInput
          style={styles.input}
          placeholder="Add a task..."
          value={title}
          onChangeText={setTitle}
        />


        <TouchableOpacity
          style={styles.addButton}
          onPress={createTask}
        >

          <Text style={styles.addButtonText}>
            Add
          </Text>

        </TouchableOpacity>

      </View>


      <FlatList

        data={tasks}

        keyExtractor={(item) =>
          item.id.toString()
        }

        renderItem={({ item }) => (

          <View style={styles.task}>

            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() =>
                completeTask(item.id)
              }
            >

              <Text
                style={
                  item.completed
                    ? styles.completed
                    : styles.taskText
                }
              >

                {item.title}

              </Text>

            </TouchableOpacity>


            <TouchableOpacity
              onPress={() =>
                deleteTask(item.id)
              }
            >

              <Text style={styles.delete}>
                Delete
              </Text>

            </TouchableOpacity>

          </View>

        )}

      />

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 25,
    marginTop: 40
  },

  title: {
    fontSize: 32,
    fontWeight: "bold"
  },

  subtitle: {
    marginBottom: 25
  },

  inputRow: {
    flexDirection: "row",
    marginBottom: 20
  },

  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8
  },

  addButton: {
    marginLeft: 10,
    padding: 12,
    backgroundColor: "black",
    borderRadius: 8
  },

  addButtonText: {
    color: "white"
  },

  task: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1
  },

  taskText: {
    fontSize: 18
  },

  completed: {
    fontSize: 18,
    textDecorationLine: "line-through"
  },

  delete: {
    marginLeft: 10
  }

});
