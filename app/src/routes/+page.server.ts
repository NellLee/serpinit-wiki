import { initWiki } from "$lib/utilities/wiki"
import { redirect } from "@sveltejs/kit"

export function load() {
    redirect(302, "content")
}