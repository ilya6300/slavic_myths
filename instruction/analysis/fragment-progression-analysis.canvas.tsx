import {
  BarChart,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Grid,
  H1,
  H2,
  LineChart,
  Row,
  Stack,
  Stat,
  Table,
  Text,
  useHostTheme,
} from "cursor/canvas";

export default function FragmentProgressionAnalysis() {
  const theme = useHostTheme();

  return (
    <Stack gap={24} style={{ maxWidth: 1120, margin: "0 auto", padding: 24 }}>
      <Stack gap={6}>
        <H1>Фрагменты: достижимость и монетизация</H1>
        <Text tone="secondary">
          Сценарный расчёт для когорты 10 000. Не заменяет аналитику после релиза.
          Канон правил ежедневки и осколков — instruction/plans/draft.md §2, §8.
        </Text>
      </Stack>

      <Grid columns={3} gap={12}>
        <Stack gap={2}>
          <Stat label="План в draft (46)" value="46" tone="warning" />
          <Text size="small" tone="tertiary">фрагментов, 1/день</Text>
        </Stack>
        <Stack gap={2}>
          <Stat label="При 2 ежи/день" value="34" tone="success" />
          <Text size="small" tone="tertiary">рекомендуемая сумма фрагментов</Text>
        </Stack>
        <Stack gap={2}>
          <Stat label="Мин. календарь (2/день)" value="17" />
          <Text size="small" tone="tertiary">дней при идеальном темпе</Text>
        </Stack>
      </Grid>

      <Callout tone="danger" title="Отклонено: догон пачкой">
        Не копить пропущенные дни и не закрывать 2–3 ежедневки за один заход. Это
        утомляет и ломает ритм «сказ дня».
      </Callout>

      <Callout tone="info" title="Допустимо: ускорение в активный день">
        До 2 полных ежедневок за один календарный день → до 2 фрагментов. Вторая —
        отдельный цикл (ещё 100 кликов + другой сказ/вопрос). Пропущенные прошлые
        дни не восстанавливаются.
      </Callout>

      <Grid columns="minmax(0, 1.45fr) minmax(280px, 0.85fr)" gap={20}>
        <Stack gap={10}>
          <H2>Возвращаемость (ориентиры)</H2>
          <LineChart
            categories={["D1", "D7", "D30", "D46"]}
            series={[
              { name: "Медиана рынка (2025)", data: [22, 4, 0.7, 0.4], tone: "danger" },
              { name: "Сильный casual (цель)", data: [30, 10, 4, 2.5], tone: "success" },
            ]}
            valueSuffix="%"
            height={270}
            showValues
          />
          <Text size="small" tone="tertiary">
            D46 — экстраполяция, не официальный бенчмарк. Яндекс Игры: D1, D3, D7,
            D14, Week 2, Month 2.
          </Text>
        </Stack>

        <Card>
          <CardHeader>D46 при 1 фрагменте/день</CardHeader>
          <CardBody>
            <Stack gap={12}>
              <Row justify="space-between">
                <Text>Дошли до D46 (сильный casual)</Text>
                <Text weight="semibold">~250 / 10k</Text>
              </Row>
              <Row justify="space-between">
                <Text>Собрали 46 осколков</Text>
                <Text weight="semibold">ещё меньше</Text>
              </Row>
              <Text size="small" tone="tertiary">
                Пропуск дня без догона сдвигает цепочку; Перун уходит в «никогда».
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <H2>Сравнение политик ежедневки</H2>
      <Table
        headers={["Политика", "Пропуск", "Активный игрок", "Сумма фрагментов"]}
        rows={[
          ["1 ежи / день", "осколок потерян", "1/день", "34–46"],
          ["До 2 ежи / день", "не копится", "до 2/день", "34 (рекоменд.)"],
          ["Догон 3 дня пачкой", "—", "отклонено", "—"],
        ]}
        striped
      />

      <Stack gap={10}>
        <H2>Фрагменты по духам (рекомендация при 2 ежи/день)</H2>
        <BarChart
          categories={["Яга", "Лада", "Велес", "Кощей", "Чудо-Юдо", "Ярило", "Перун"]}
          series={[
            { name: "draft.md (сейчас)", data: [3, 3, 7, 7, 8, 8, 10], tone: "warning" },
            { name: "Рекомендация", data: [3, 3, 5, 5, 6, 6, 6], tone: "success" },
          ]}
          valueSuffix=" шт."
          height={300}
          showValues
        />
        <Text size="small" tone="tertiary">
          Сумма рекомендации: 34. При 1 ежи/день и без ускорения можно оставить 46,
          но доля игроков, дошедших до Перуна, будет низкой.
        </Text>
      </Stack>

      <Card>
        <CardHeader>Лавка и свечи (кратко)</CardHeader>
        <CardBody>
          <Grid columns={3} gap={12}>
            <Stack gap={2}>
              <Stat label="Угадал" value="10" tone="success" />
              <Text size="small" tone="tertiary">крупиц</Text>
            </Stack>
            <Stack gap={2}>
              <Stat label="Скин" value="30" />
              <Text size="small" tone="tertiary">крупиц</Text>
            </Stack>
            <Stack gap={2}>
              <Stat label="Витрина" value="395" />
              <Text size="small" tone="tertiary">крупиц всего</Text>
            </Stack>
          </Grid>
          <Text tone="secondary">
            IAP: пакет свечей, цену из SDK (яны), не хардкод «39 ₽» в UI.
          </Text>
        </CardBody>
      </Card>

      <Text
        size="small"
        tone="tertiary"
        style={{ borderTop: `1px solid ${theme.stroke.tertiary}`, paddingTop: 12 }}
      >
        Источники: yandex.ru/dev/games (метрики, IAP); GameAnalytics 2025 (медиана D1
        ~22%, D7 ~4%, D30 ~0,7%).
      </Text>
    </Stack>
  );
}
