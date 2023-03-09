<template>
  <div class="container mx-auto p-4">
    <h1 class="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Create new education entry</h1>
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2" for="name">
          Name
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          v-model="form.name"
          required
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2" for="description">
          Description
        </label>
        <textarea
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          v-model="form.description"
          required
        ></textarea>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2" for="created_at">
          Created At
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="created_at"
          type="date"
          v-model="form.created_at"
          required
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2" for="ended_at">
          Ended At
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="ended_at"
          type="date"
          v-model="form.ended_at"
          required
        />
      </div>
      <div class="flex items-center justify-end">
        <button
          class="bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:cursor-not-allowed disabled:opacity-75"
          type="submit"
          :disabled="!isFormValid"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "../interceptor/http.interceptor";
import { useToast } from "vue-toastification";
const toast = useToast();

export default {
  data() {
    return {
      form: {
        name: "",
        description: "",
        created_at: new Date().now,
        ended_at: new Date().now,
      },
    };
  },
  computed: {
    isFormValid() {
      return (
        this.form.name &&
        this.form.description &&
        this.form.created_at &&
        this.form.ended_at
      );
    },
  },
  methods: {
    submitForm() {
        if (new Date(this.form.ended_at).valueOf() <= new Date(this.form.created_at).valueOf()) {
            toast.error("Ended date cannot be before or on the same date as the created date", { timeout: 5000 });
            return;
        }

      axios
        .post("https://stansmits.nl/api/education", {
          name: this.form.name,
          description: this.form.description,
          created_at: (new Date(this.form.ended_at).valueOf()/1000).toString(),
          ended_at: (new Date(this.form.ended_at).valueOf()/1000).toString(),
        })
        .then((response) => {
            toast.success("Education entry created successfully");
            setTimeout(() => {
                this.$router.push("/education");
            }, 1500);
        })
        .catch((error) => {
            toast.error("Something went wrong" + error);
        });
    },
  },
};
</script>
