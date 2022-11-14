# Queries

lmk if you get stuck / need some design help! my suggestion is finishing the current MVP page (given day), then reviewing and moving on to week/month or a per-domain view (and probably writing blog posts about this)

## Current query on a given day

```shell
curl -iH "Content-Type: application/json" -XPOST https://seafowl-socrata.fly.dev/q -d@- <<EOF
{"query": "
  SELECT
    d.domain,
    d.name,
    is_added,
    id,
    d.description
  FROM socrata.daily_diff dd INNER JOIN socrata.all_datasets d
    ON dd.id = d.id
  WHERE dd.day::text = '2022-11-02 00:00:00'
  ORDER BY 1, 3, 2
"}
EOF
```

## Get dataset counts since beginning

```shell
curl -iH "Content-Type: application/json" -XPOST https://seafowl-socrata.fly.dev/q -d@- <<EOF
{"query": "
SELECT sg_image_created, sg_image_tag, COUNT(*) AS total_datasets FROM socrata.dataset_history GROUP BY 1, 2 ORDER BY 1 ASC;
"}
EOF
```

## How many datasets CDC added/removed for a given week

```shell
curl -iH "Content-Type: application/json" -XPOST https://seafowl-socrata.fly.dev/q -d@- <<EOF
{"query": "
  SELECT
    wd.week,
    SUM(CASE WHEN wd.is_added THEN 1 ELSE 0 END) AS added,
    SUM(CASE WHEN wd.is_added THEN 0 ELSE 1 END) AS removed
  FROM socrata.weekly_diff wd INNER JOIN socrata.all_datasets d
    ON wd.id = d.id
  WHERE d.domain = 'data.cdc.gov'
  GROUP BY 1
  ORDER BY 1 ASC
"}
EOF
```

## "heatmap" of how many datasets a domain has on any given day:

```shell
curl -iH "Content-Type: application/json" -XPOST https://seafowl-socrata.fly.dev/q -d@- <<EOF
{"query": "
  SELECT
    DATE_TRUNC('day', sg_image_created) AS day,
    COUNT(*) AS dataset_count
  FROM socrata.dataset_history
  WHERE domain = 'data.cdc.gov'
  GROUP BY 1
  ORDER BY 1 ASC
"}
EOF
```
