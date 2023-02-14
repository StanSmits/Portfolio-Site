<template>
  <button
    class="bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline m-5"
    @click="$router.push('new-education')"
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
          Delete
        </th>
      </tr>
    </thead>
    <tbody class="bg-white dark:bg-slate-800">
      <!-- For each item in the array from the database do this -->
      <tr v-for="eduItem in data">
        <td
          class="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400"
        >
          {{ eduItem.name }}
        </td>
        <td
          class="border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400"
        >
          {{ eduItem.description }}
        </td>
        <td
          class="border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400"
        >
          {{ formatDate(eduItem.created_at) }}
        </td>
        <td
          class="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400"
        >
          {{ formatDate(eduItem.ended_at) || "Present" }}
        </td>
        <td
          class="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400"
        >
          <button
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            @click="deleteEntry(eduItem.id)"
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
import { useRouter } from 'vue-router'
const router = useRouter();
import { useToast } from "vue-toastification";
const toast = useToast();

export default {
  name: "Education",

  data() {
    return {
      data: [],
      form: {
        name: "",
        description: "",
        created_at: "",
        ended_at: "",
      },
    };
  },

  methods: {
    deleteEntry(eduName) {
      axios
        .delete(`http://139.162.162.34:8080/education/${eduName}`)
        .then((response) => {
            toast.success("Entry deleted");
        })
        .catch((error) => {
            toast.error("Something went wrong");
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
      .get("http://139.162.162.34:8080/education")
      .then((response) => {
        this.data = response.data;
        toast.success("Data loaded");
      })
      .catch((error) => {
        toast.error("Something went wrong");
      });
  },
};
</script>
