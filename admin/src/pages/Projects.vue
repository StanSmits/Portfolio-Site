<template>
  <div class="flex justify-center items-center" id="loading-spinner">
    <svg
      class="animate-spin -ml-1 mr-3 h-1/2 w-1/2 text-black"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
  <div id="main-content" class="hidden">
    <button
      class="bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline m-5 animate-pulse animate-once animate-duration-[400ms] animate-ease-out animate-normal animate-fill-both"
      @click="$router.push('new-project')"
    >
      Create new entry
    </button>
    <table class="border-collapse table-auto w-full text-sm">
      <thead>
        <tr>
          <th
            class="border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 text-left"
          >
            Name
          </th>
          <th
            class="border-b font-medium p-4 pt-0 pb-3 text-slate-400 text-left"
          >
            Description
          </th>
          <th
            class="border-b font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 text-left"
          >
            Created at
          </th>
          <th
            class="border-b font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 text-left"
          >
            Ended at
          </th>
          <th
            class="border-b font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 text-left"
          >
            URL
          </th>
          <th
            class="border-b font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 text-left"
          >
            Delete
          </th>
        </tr>
      </thead>
      <tbody class="bg-white">
        <!-- For each item in the array from the database do this -->
        <tr
          v-for="projItem in data"
          class="opacity-0 animate-fade-right animate-once animate-duration-[800ms] animate-ease-in-out animate-normal animate-fill-forwards"
        >
          <td
            class="border-b border-slate-100 p-4 pl-8 text-slate-500"
            v-bind:data-id="projItem.id"
          >
            {{ projItem.name }}
          </td>
          <td class="border-b border-slate-100 p-4 text-slate-500">
            {{ projItem.description }}
          </td>
          <td class="border-b border-slate-100 p-4 text-slate-500">
            {{ formatDate(projItem.created_at) }}
          </td>
          <td class="border-b border-slate-100 p-4 pr-8 text-slate-500">
            {{ formatDate(projItem.ended_at) || "Present" }}
          </td>
          <td class="border-b border-slate-100 p-4 pr-8 text-slate-500">
            <a
              :href="projItem.html_url"
              class="text-blue-500 font-bold hover:text-blue-600 hover:underline hover:bg-gray-200"
              >{{ projItem.html_url }}</a
            >
          </td>
          <td class="border-b border-slate-100 p-4 pr-8 text-slate-500">
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
  </div>
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
    deleteEntry(projectID) {
      axios
        .delete(`https://stansmits.nl/api/projects/${projectID}`)
        .then((response) => {
          toast.success("Project deleted");
          document.querySelector(
            `[data-id="${projectID}"]`
          ).parentElement.className =
            "animate-fade-up animate-once animate-duration-[400ms] animate-ease-out animate-reverse animate-fill-both";
          setTimeout(() => {
            document
              .querySelector(`[data-id="${projectID}"]`)
              .parentElement.remove();
          }, 500);
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
      .get("https://stansmits.nl/api/projects")
      .then((response) => {
        this.data = response.data;
        toast.success("Data loaded");
        document.getElementById("loading-spinner").className = "hidden";
        document.getElementById("main-content").className = "";
      })
      .catch((error) => {
        toast.error("Error loading data: " + error);
      });
  },
};
</script>
