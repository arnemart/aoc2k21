(ns aoc.2022.05.5
  (:require [aoc.common :refer [read-input zipv]]
            [clojure.string :as str]))

(defn move [rev]
  (fn [stacks [num from to]]
    (let [where (- (count (get stacks from)) num)
          to-add ((if rev reverse identity) (subvec (get stacks from) where))]
      (-> stacks
          (update to #(reduce conj % to-add))
          (update from subvec 0 where)))))

(defn solve [stacks ops move]
  (->> ops
       (reduce move stacks)
       (map last)
       str/join))

(let [[part1 part2] (->> (read-input :split-with #"\n\n")
                         (map #(str/split % #"\n")))
      stacks (->> part1
                  drop-last
                  (map #(str/split % #""))
                  (map (fn [stack]
                         (->> (range 1 34 4)
                              (map #(nth stack %)))))
                  (apply zipv)
                  (map reverse)
                  (mapv (fn [l] (vec (take-while #(not (str/blank? %)) l)))))
      ops (->> part2
               (map #(re-seq #"\d+" %))
               (map #(map parse-long %))
               (map (fn [[a b c]] [a (dec b) (dec c)])))]

  (println "Part 1:" (solve stacks ops (move true)))
  (println "Part 2:" (solve stacks ops (move false))))