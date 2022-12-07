(ns aoc.2022.07.7
  (:require [aoc.common :refer [read-input sum]]
            [clojure.string :as str]))

(defn build-tree
  ([cmds] (build-tree cmds {} []))
  ([cmds tree path]
   (if-let [cmd (first cmds)]
     (let [cmds (rest cmds)
           parts (str/split cmd #" ")]
       (condp re-matches cmd
         #"\$ cd \.\." (recur cmds tree (pop path))
         #"\$ cd .+"   (recur cmds tree (conj path (last parts)))
         #"\d+ .+"     (recur cmds (assoc-in tree (conj path :files (last parts)) (parse-long (first parts))) path)
         (recur cmds tree path)))
     tree)))

(defn folder-sizes
  ([tree] (folder-sizes tree {} []))
  ([tree folders path]
   (->> (get-in tree path)
        keys
        (filter #(not= :files %))
        (reduce (fn [folders f]
                  (let [p (conj path f)
                        filesize (-> (get-in tree (conj p :files)) vals sum)
                        folders (folder-sizes tree folders p)]
                    (assoc folders p (+ filesize (->> folders (filter #(= p (pop (first %)))) vals sum)))))
                folders))))

(let [folders (->> (read-input)
                   build-tree
                   folder-sizes)
      free-space (- 70000000 (get folders ["/"]))]

  (->> folders
       vals
       (filter #(<= % 100000))
       sum
       (println "Part 1:"))

  (->> folders
       vals
       (filter #(>= % (- 30000000 free-space)))
       (apply min)
       (println "Part 2:")))