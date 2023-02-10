<template>
  <button
    class="bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline m-5"
    @click="$router.push('new-project')"
  >
    Create new entry
  </button>
  <table class="border-collapse table-auto w-full text-sm">
    <thead>
      <tr>
        <th
          class="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left"
        >
          Name
        </th>
        <th
          class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left"
        >
          Description
        </th>
        <th
          class="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left"
        >
          Created at
        </th>
        <th
          class="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left"
        >
          Ended at
        </th>
        <th
          class="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left"
        >
          URL
        </th>
        <th
          class="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left"
        >
          Delete
        </th>
      </tr>
    </thead>
    <tbody class="bg-white dark:bg-slate-800">
      <!-- For each item in the array from the database do this -->
      <tr v-for="projItem in data">
        <td
          class="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400"
        >
          {{ projItem.name }}
        </td>
        <td
          class="border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400"
        >
          {{ projItem.description }}
        </td>
        <td
          class="border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400"
        >
          {{ formatDate(projItem.created_at) }}
        </td>
        <td
          class="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400"
        >
          {{ formatDate(projItem.ended_at) || "Present" }}
        </td>
        <td
          class="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400"
        >
          <a
            :href="projItem.html_url"
            class="text-blue-500 font-bold hover:text-blue-600 hover:underline hover:bg-gray-200"
            >{{ projItem.html_url }}</a
          >
        </td>
        <td
          class="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400"
        >
          <button
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            @click="deleteEntry(projItem.id)"
          >
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import axios from "../interceptor/http.interceptor";

import { useRouter } from "vue-router";
const router = useRouter();
import { useToast } from "vue-toastification";
const toast = useToast();

export default {
  name: "Projects",

  data() {
    return {
      data: [],
      form: {
        name: "",
        description: "",
        created_at: "",
        ended_at: "",
        html_url: "",
      },
    };
  },

  methods: {
    submitForm() {
      console.log(this.form);
    },

    deleteEntry(projectID) {
      axios
        .delete(`http://localhost:8080/projects/${projectID}`)
        .then((response) => {
            toast.success("Project deleted");
        })
        .catch((error) => {
            toast.error("Error deleting project" + error);
        });
    },

    formatDate(inputDateString) {
      const date = new Date(parseInt(inputDateString) * 1000);
      return date.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },
  },

  async mounted() {
    await axios
      .get("http://localhost:8080/projects")
      .then((response) => {
        this.data = response.data;
        toast.success("Data loaded");
      })
      .catch((error) => {
        toast.error("Error loading data");
      });
  },
};
</script>
