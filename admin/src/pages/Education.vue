<!-- 
  TODO!:
    * PROJECTS + EDUCATION
      - On delete, remove item from the list
        > Hopefully we can remove the row 
          but worst case scenerio we can just reload the page
      
      - Create new entry button animation
      - Offset the animation of the table row
      - Add a loading animation
      - Toast notification should have margin on top so it doens't interfere with login screen
    
      * Home page
        - Add a loading animation
        - Add a icon to each of the elements

      *  Login page
        - Add a loading animation

      * Menu sidebar
        - Add an icon to each of the elements
 -->
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
          class="border-b  font-medium p-4 pl-8 pt-0 pb-3 text-slate-400  text-left"
        >
          Name
        </th>
        <th
          class="border-b  font-medium p-4 pt-0 pb-3 text-slate-400  text-left"
        >
          Description
        </th>
        <th
          class="border-b  font-medium p-4 pr-8 pt-0 pb-3 text-slate-400  text-left"
        >
          Created at
        </th>
        <th
          class="border-b  font-medium p-4 pr-8 pt-0 pb-3 text-slate-400  text-left"
        >
          Ended at
        </th>
        <th
          class="border-b  font-medium p-4 pr-8 pt-0 pb-3 text-slate-400  text-left"
        >
          Delete
        </th>
      </tr>
    </thead>
    <tbody class="bg-white">
      <tr v-for="eduItem, index in data" class="opacity-0 animate-fade-right animate-once animate-duration-[800ms] animate-ease-in-out animate-normal animate-fill-forwards">
        <td
          class="border-b border-slate-100  p-4 pl-8 text-slate-500"
          v-bind:data-id="eduItem.id"
        >
          {{ eduItem.name }}
        </td>
        <td
          class="border-b border-slate-100  p-4 text-slate-500 "
        >
          {{ eduItem.description }}
        </td>
        <td
          class="border-b border-slate-100  p-4 text-slate-500 "
        >
          {{ formatDate(eduItem.created_at) }}
        </td>
        <td
          class="border-b border-slate-100  p-4 pr-8 text-slate-500 "
        >
          {{ formatDate(eduItem.ended_at) || "Present" }}
        </td>
        <td
          class="border-b border-slate-100  p-4 pr-8 text-slate-500 "
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
    deleteEntry(eduID) {
      axios
        .delete(`http://139.162.162.34:8080/education/${eduID}`)
        .then((response) => {
            toast.success("Entry deleted");
            document.querySelector(`[data-id="${eduID}"]`).parentElement.className = "animate-fade-up animate-once animate-duration-[400ms] animate-ease-out animate-reverse animate-fill-both";
            setTimeout(() => {
              document.querySelector(`[data-id="${eduID}"]`).parentElement.remove();
            }, 500);
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
