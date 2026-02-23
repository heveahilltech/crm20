import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditModule } from 'src/engine/core-modules/audit/audit.module';
import { MetricsModule } from 'src/engine/core-modules/metrics/metrics.module';
<<<<<<< HEAD
import { SecureHttpClientModule } from 'src/engine/core-modules/secure-http-client/secure-http-client.module';
import { FlatWebhookModule } from 'src/engine/metadata-modules/flat-webhook/flat-webhook.module';
import { CallWebhookJobsForMetadataJob } from 'src/engine/metadata-modules/webhook/jobs/call-webhook-jobs-for-metadata.job';
=======
import { ToolModule } from 'src/engine/core-modules/tool/tool.module';
import { WebhookEntity } from 'src/engine/metadata-modules/webhook/entities/webhook.entity';
>>>>>>> hevea-local
import { CallWebhookJobsJob } from 'src/engine/metadata-modules/webhook/jobs/call-webhook-jobs.job';
import { CallWebhookJob } from 'src/engine/metadata-modules/webhook/jobs/call-webhook.job';

@Module({
  imports: [
    TypeOrmModule.forFeature([WebhookEntity]),
    AuditModule,
    FlatWebhookModule,
    MetricsModule,
    ToolModule,
  ],
  providers: [
    CallWebhookJobsJob,
    CallWebhookJobsForMetadataJob,
    CallWebhookJob,
  ],
})
export class WebhookJobModule {}
